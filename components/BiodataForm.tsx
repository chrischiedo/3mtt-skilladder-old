"use client"
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { StepNavigation } from './StepNavigation';
import Loader from './Loader';
import DownloadResume from './resume/DownloadResume';

interface Certification {
  name: string;
  issuer: string;
  year: string;
}

interface Project {
  name: string;
  description: string;
  technologies: string;
}

interface TechnicalSkill {
  name: string;
}

interface Education {
  type: string;
  startYear: string;
  endYear: string;
  institution: string;
  location: string;
  course: string;
  notes: string;
}

interface WorkExperience {
  role: string;
  startDate: string;
  endDate: string;
  company: string;
  location: string;
  notes: string;
}

interface BiodataFormValues {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  lga: string;
  state: string;
  phoneNumber: string;
  email: string;
  educationLevel: string;
  fieldOfStudy: string;
  certifications: Certification[];
  employmentStatus: string;
  workExperience: string;
  technicalSkills: TechnicalSkill[];
  learningTrack: string;
  projectExperience: {
    hasProjects: boolean;
    projects: Project[];
  };
  accessibilityNeeds: {
    hasNeeds: boolean;
    description: string;
  };
  educationHistory: Education[];
  workExperienceHistory: WorkExperience[];
  yearsOfExperience: string;
}

const AVAILABLE_SKILLS = [
  'Python',
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'AWS',
  'Docker',
  'Kubernetes',
  'Git',
  'SQL',
  'MongoDB',
  'Java',
  'C++',
  'Ruby',
  'PHP',
  'Swift',
  'Go',
  'Rust',
].sort();

const validationSchema = Yup.object({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  dateOfBirth: Yup.date().required('Required'),
  gender: Yup.string().required('Required'),
  lga: Yup.string().required('LGA is required'),
  state: Yup.string().required('State is required'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(
      /^(\+234|0)[0-9]{10}$/,
      'Please enter a valid Nigerian phone number'
    ),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  educationLevel: Yup.string(),
  fieldOfStudy: Yup.string(),
  employmentStatus: Yup.string(),
  workExperience: Yup.string(),
  learningTrack: Yup.string(),
});

const BiodataForm = ({ data }: { data: BiodataFormValues }) => {
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showStepNavigation, setShowStepNavigation] = useState<boolean>(false);
  const [cvData, setCvData] = useState(null);

  const initialValues: BiodataFormValues = {
    firstName: data?.firstName || '',
    lastName: data?.lastName || '',
    dateOfBirth: data?.dateOfBirth || '',
    gender: data?.gender || '',
    lga: data?.lga || '',
    state: data?.state || '',
    phoneNumber: data?.phoneNumber || '',
    email: data?.email || '',
    educationLevel: data?.educationLevel || '',
    fieldOfStudy: data?.fieldOfStudy || '',
    certifications: data?.certifications || [],
    employmentStatus: data?.employmentStatus || '',
    workExperience: data?.workExperience || '',
    technicalSkills: data?.technicalSkills || [],
    learningTrack: data?.learningTrack || '',
    projectExperience: {
      hasProjects: data?.projectExperience?.hasProjects || false,
      projects: data?.projectExperience?.projects || [],
    },
    accessibilityNeeds: {
      hasNeeds: data?.accessibilityNeeds?.hasNeeds || false,
      description: data?.accessibilityNeeds?.description || '',
    },
    educationHistory: data?.educationHistory || [],
    workExperienceHistory: data?.workExperienceHistory || [],
    yearsOfExperience: data?.yearsOfExperience || '',
  };

  

  return (
    <div className="max-w-4xl mx-auto p-6">
     
      <h1 className="text-2xl font-bold mb-6">Biodata Form</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setErrors }) => {
          try {
            setIsSubmitting(true);
          
            // Validate the form
            try {
              await validationSchema.validate(values, { abortEarly: false });
            } catch (err: any) {
            //   err.inner.forEach((error: any) => {
            //     toast.error(error.message);
            //   });
              
              if (err.inner.length > 0) {
                setErrors(
                  err.inner.reduce((acc: any, error: any) => {
                    acc[error.path] = error.message;
                    return acc;
                  }, {})
                );
              }
              
              setIsSubmitting(false);
              return;
            }

            // Submit the form data
            const response = await fetch('/api/save_biodata', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || 'Something went wrong');
            }

            //store cv data
            setCvData(data.data)

            // Show success message
            toast.success('Biodata saved successfully!');
            setShowStepNavigation(true)
            
          } catch (error: any) {
            // Show error message
            toast.error(error.message || 'Failed to save biodata');
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form className="space-y-6">
            {/* Personal Information */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName">First Name</label>
                  <Field
                    name="firstName"
                    type="text"
                    className="w-full border rounded p-2"
                  />
                  {errors.firstName && touched.firstName && (
                    <div className="text-red-500">{errors.firstName}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName">Last Name</label>
                  <Field
                    name="lastName"
                    type="text"
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <Field
                    name="dateOfBirth"
                    type="date"
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label htmlFor="gender">Gender</label>
                  <Field
                    as="select"
                    name="gender"
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Field>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state">State of Residence</label>
                  <Field
                    as="select"
                    name="state"
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select State</option>
                    <option value="Abia">Abia</option>
                    <option value="Adamawa">Adamawa</option>
                    <option value="Akwa Ibom">Akwa Ibom</option>
                    <option value="Anambra">Anambra</option>
                    <option value="Bauchi">Bauchi</option>
                    <option value="Bayelsa">Bayelsa</option>
                    <option value="Benue">Benue</option>
                    <option value="Borno">Borno</option>
                    <option value="Cross River">Cross River</option>
                    <option value="Delta">Delta</option>
                    <option value="Ebonyi">Ebonyi</option>
                    <option value="Edo">Edo</option>
                    <option value="Ekiti">Ekiti</option>
                    <option value="Enugu">Enugu</option>
                    <option value="FCT">Federal Capital Territory</option>
                    <option value="Gombe">Gombe</option>
                    <option value="Imo">Imo</option>
                    <option value="Jigawa">Jigawa</option>
                    <option value="Kaduna">Kaduna</option>
                    <option value="Kano">Kano</option>
                    <option value="Katsina">Katsina</option>
                    <option value="Kebbi">Kebbi</option>
                    <option value="Kogi">Kogi</option>
                    <option value="Kwara">Kwara</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Nasarawa">Nasarawa</option>
                    <option value="Niger">Niger</option>
                    <option value="Ogun">Ogun</option>
                    <option value="Ondo">Ondo</option>
                    <option value="Osun">Osun</option>
                    <option value="Oyo">Oyo</option>
                    <option value="Plateau">Plateau</option>
                    <option value="Rivers">Rivers</option>
                    <option value="Sokoto">Sokoto</option>
                    <option value="Taraba">Taraba</option>
                    <option value="Yobe">Yobe</option>
                    <option value="Zamfara">Zamfara</option>
                  </Field>
                </div>
                <div>
                  <label htmlFor="lga">LGA of Residence</label>
                  <Field
                    name="lga"
                    type="text"
                    className="w-full border rounded p-2"
                    placeholder="Enter your LGA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <Field
                    name="phoneNumber"
                    type="tel"
                    className="w-full border rounded p-2"
                    placeholder="e.g., +234 XXX XXX XXXX"
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <div className="text-red-500">{errors.phoneNumber}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="email">Email Address</label>
                  <Field
                    name="email"
                    type="email"
                    className="w-full border rounded p-2"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-500">{errors.email}</div>
                  )}
                </div>
              </div>
            </section>

            {/* Employment Status and Years of Experience */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Employment Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="employmentStatus">Current Employment Status</label>
                  <Field
                    as="select"
                    name="employmentStatus"
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select Status</option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-employed</option>
                    <option value="student">Student</option>
                    <option value="unemployed">Unemployed</option>
                  </Field>
                </div>
                <div>
                  <label htmlFor="yearsOfExperience">Years of Work Experience</label>
                  <Field
                    as="select"
                    name="yearsOfExperience"
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select Experience</option>
                    <option value="<1">Less than 1 Year</option>
                    <option value="1-3">1-3 Years</option>
                    <option value="4-6">4-6 Years</option>
                    <option value="7+">7+ Years</option>
                  </Field>
                </div>
              </div>
            </section>

            {/* Technical Skills */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Technical Skills</h2>
              <FieldArray name="technicalSkills">
                {({ push, remove }) => (
                  <div>
                    <div className="flex flex-col lg:flex-row gap-4 mb-4">
                      <div className="flex-grow">
                        <Field
                          as="select"
                          name="skillSelect"
                          className="w-full border rounded p-2"
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            if (e.target.value) {
                              const skillExists = values.technicalSkills.some(
                                skill => skill.name.toLowerCase() === e.target.value.toLowerCase()
                              );
                              if (!skillExists) {
                                push({ name: e.target.value });
                              }
                              e.target.value = ''; // Reset select after adding
                            }
                          }}
                        >
                          <option value="">Select or type a skill</option>
                          {AVAILABLE_SKILLS.map(skill => (
                            <option key={skill} value={skill}>
                              {skill}
                            </option>
                          ))}
                        </Field>
                      </div>
                      <div className="flex-grow">
                        <Field
                          type="text"
                          name="customSkill"
                          className="w-full border rounded p-2"
                          placeholder="Or type a custom skill and press Enter"
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              const value = input.value.trim();
                              if (value) {
                                const skillExists = values.technicalSkills.some(
                                  skill => skill.name.toLowerCase() === value.toLowerCase()
                                );
                                if (!skillExists) {
                                  push({ name: value });
                                }
                                input.value = ''; // Clear input after adding
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {values.technicalSkills.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                        >
                          <span>{skill.name}</span>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700 text-lg"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </FieldArray>
            </section>

            {/* Educational Background */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Educational Background</h2>
              <div>
                <label htmlFor="educationLevel">Highest Level of Education</label>
                <Field
                  as="select"
                  name="educationLevel"
                  className="w-full border rounded p-2"
                >
                  <option value="">Select Education Level</option>
                  <option value="secondary_school_certificate">Secondary School Certificate</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelors">Bachelor's Degree</option>
                  <option value="masters">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="others">Others</option>
                </Field>
              </div>

              {/* Education History */}
              <FieldArray name="educationHistory">
                {({ push, remove }) => (
                  <div>
                    {values.educationHistory.map((_, index) => (
                      <div key={index} className="p-4 border rounded-lg mb-4 bg-gray-50">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label>Type</label>
                            <Field
                              as="select"
                              name={`educationHistory.${index}.type`}
                              className="w-full border rounded p-2"
                            >
                              <option value="">Select Type</option>
                              <option value="primary">Primary</option>
                              <option value="secondary">Secondary</option>
                              <option value="bachelors">Bachelors</option>
                              <option value="masters">Masters</option>
                              <option value="phd">PhD</option>
                              <option value="others">Others</option>
                            </Field>
                          </div>
                          <div>
                            <label>Institution</label>
                            <Field
                              type="text"
                              name={`educationHistory.${index}.institution`}
                              className="w-full border rounded p-2"
                              placeholder="Enter institution (e.g., University of Lagos)"
                            />
                          </div>
                          <div>
                            <label>Location</label>
                            <Field
                              type="text"
                              name={`educationHistory.${index}.location`}
                              className="w-full border rounded p-2"
                              placeholder="City, Country"
                            />
                          </div>
                          <div>
                            <label>Course of Study / Certificate</label>
                            <Field
                              type="text"
                              name={`educationHistory.${index}.course`}
                              className="w-full border rounded p-2"
                              placeholder="Enter course name"
                            />
                          </div>
                          <div>
                            <label>Start Year</label>
                            <Field
                              type="number"
                              name={`educationHistory.${index}.startYear`}
                              className="w-full border rounded p-2"
                              placeholder="YYYY"
                            />
                          </div>
                          <div>
                            <label>End Year</label>
                            <Field
                              type="number"
                              name={`educationHistory.${index}.endYear`}
                              className="w-full border rounded p-2"
                              placeholder="YYYY"
                            />
                          </div>
                          <div className="col-span-2">
                            <label>Additional Notes</label>
                            <Field
                              as="textarea"
                              name={`educationHistory.${index}.notes`}
                              className="w-full border rounded p-2"
                              placeholder="Any additional information"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                          Remove Education
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        push({
                          type: '',
                          startYear: '',
                          endYear: '',
                          institution: '',
                          location: '',
                          course: '',
                          notes: '',
                        })
                      }
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Add Education
                    </button>
                  </div>
                )}
              </FieldArray>
            </section>

            {/* Work Experience History */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Work Experience History</h2>
              <FieldArray name="workExperienceHistory">
                {({ push, remove }) => (
                  <div>
                    {values.workExperienceHistory.map((_, index) => (
                      <div key={index} className="p-4 border rounded-lg mb-4 bg-gray-50">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label>Role</label>
                            <Field
                              type="text"
                              name={`workExperienceHistory.${index}.role`}
                              className="w-full border rounded p-2"
                              placeholder="Job Title"
                            />
                          </div>
                          <div>
                            <label>Company</label>
                            <Field
                              type="text"
                              name={`workExperienceHistory.${index}.company`}
                              className="w-full border rounded p-2"
                              placeholder="Company Name"
                            />
                          </div>
                          <div>
                            <label>Start Date</label>
                            <Field
                              type="date"
                              name={`workExperienceHistory.${index}.startDate`}
                              className="w-full border rounded p-2"
                            />
                          </div>
                          <div>
                            <label>End Date</label>
                            <Field
                              type="date"
                              name={`workExperienceHistory.${index}.endDate`}
                              className="w-full border rounded p-2"
                            />
                          </div>
                          <div>
                            <label>Location</label>
                            <Field
                              type="text"
                              name={`workExperienceHistory.${index}.location`}
                              className="w-full border rounded p-2"
                              placeholder="City, Country"
                            />
                          </div>
                          <div>
                            <label>Notes</label>
                            <Field
                              as="textarea"
                              name={`workExperienceHistory.${index}.notes`}
                              className="w-full border rounded p-2"
                              placeholder="Additional details about your role"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                          Remove Experience
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        push({
                          role: '',
                          startDate: '',
                          endDate: '',
                          company: '',
                          location: '',
                          notes: '',
                        })
                      }
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Add Work Experience
                    </button>
                  </div>
                )}
              </FieldArray>
            </section>

            {/* Project Experience */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Project Experience</h2>
              <div>
                <label>
                  <Field type="checkbox" name="projectExperience.hasProjects" />
                  Have you participated in any tech-related projects?
                </label>
              </div>

              {values.projectExperience.hasProjects && (
                <FieldArray name="projectExperience.projects">
                  {({ push, remove }) => (
                    <div>
                      {values.projectExperience.projects.map((_, index) => (
                        <div key={index} className="space-y-2 mt-2">
                          <Field
                            name={`projectExperience.projects.${index}.name`}
                            placeholder="Project Name"
                            className="w-full border rounded p-2"
                          />
                          <Field
                            name={`projectExperience.projects.${index}.description`}
                            as="textarea"
                            placeholder="Project Description"
                            className="w-full border rounded p-2"
                          />
                          <Field
                            name={`projectExperience.projects.${index}.technologies`}
                            placeholder="Technologies Used"
                            className="w-full border rounded p-2"
                          />
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Remove Project
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          push({ name: '', description: '', technologies: '' })
                        }
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Add Project
                      </button>
                    </div>
                  )}
                </FieldArray>
              )}
            </section>

            {/* Certifications */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Certifications</h2>
              <FieldArray name="certifications">
                {({ push, remove }) => (
                  <div>
                    <label>Certifications</label>
                    {values.certifications.map((_, index) => (
                      <div key={index} className="flex gap-2 mt-2">
                        <Field
                          name={`certifications.${index}.name`}
                          placeholder="Certification Name"
                          className="border rounded p-2"
                        />
                        <Field
                          name={`certifications.${index}.issuer`}
                          placeholder="Issuer"
                          className="border rounded p-2"
                        />
                        <Field
                          name={`certifications.${index}.year`}
                          placeholder="Year"
                          className="border rounded p-2"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="bg-red-500 text-white px-2 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push({ name: '', issuer: '', year: '' })}
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Add Certification
                    </button>
                  </div>
                )}
              </FieldArray>
            </section>

            {/* Accessibility Needs */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Accessibility Needs</h2>
              <div>
                <label>
                  <Field
                    type="checkbox"
                    name="accessibilityNeeds.hasNeeds"
                    className="mr-2"
                  />
                  Do you have any special accessibility needs?
                </label>
              </div>

              {values.accessibilityNeeds.hasNeeds && (
                <Field
                  name="accessibilityNeeds.description"
                  as="textarea"
                  placeholder="Please specify your accessibility needs"
                  className="w-full border rounded p-2"
                />
              )}
            </section>

            {/* Disclaimer Section */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Disclaimer</h2>
              <div className="flex items-center">
                <Field
                  type="checkbox"
                  name="disclaimer"
                  className="mr-2"
                  checked={disclaimerAccepted}
                  onChange={() => {
                    setDisclaimerAccepted(!disclaimerAccepted);
                  }}
                />
                <label>
                  I understand that my personal information is required for the purpose of assessment and evaluation. 
                  This information will be kept confidential and used solely for the intended purpose.
                </label>
              </div>
            </section>

            <button
              type="submit"
              className={`w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ${!disclaimerAccepted || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!disclaimerAccepted || isSubmitting}
            >
              {isSubmitting ? <Loader /> : 'Save'}
            </button>
          </Form>
        )}
      </Formik>
      <StepNavigation 
      title="Biodata Submitted" 
      subtitle='Congratulations! You have completed this step. Please proceed to the next step to add your technical skills.' 
      nextButtonHref='/skills_extraction' 
      isOpen={showStepNavigation}>

        <div className="border-2 border-dashed border-blue-400 py-3 px-4 rounded-lg mt-4 max-w-3xl mx-auto">
        <h1 className="text-xl font-bold mb-4 text-center">
          Note
        </h1>
        <h2 className="text-base font-semibold text-muted-foreground text-center">
        The next step would require you to upload your resume. In case you don't have one prepared, we have created one for you based on the information you have provided in your biodata.
        </h2>
        <div className="flex flex-col justify-center items-center mt-4 space-y-3">
          <DownloadResume data={cvData} />
        </div>
      </div>

        
      </StepNavigation>
    </div>
  );
};

export default BiodataForm;
