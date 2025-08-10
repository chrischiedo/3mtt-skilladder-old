import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 10,
    color: '#374151',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8',
    paddingBottom: 3,
  },
  contactInfo: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  experienceItem: {
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
  description: {
    fontSize: 12,
    marginTop: 5,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  skill: {
    fontSize: 12,
    backgroundColor: '#f3f4f6',
    padding: '4 8',
    borderRadius: 4,
  },
});

// Resume Component
const Resume = () => {
  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.section}>
            <Text style={styles.header}>John Doe</Text>
            <Text style={styles.contactInfo}>
              123 Main Street, City, Country | +1 234 567 8900 |
              john.doe@email.com
            </Text>
          </View>

          {/* Summary */}
          <View style={styles.section}>
            <Text style={styles.subHeader}>Professional Summary</Text>
            <Text style={styles.description}>
              Experienced software developer with expertise in React,
              Node.js, and cloud technologies. Passionate about
              creating efficient and scalable solutions.
            </Text>
          </View>

          {/* Experience */}
          <View style={styles.section}>
            <Text style={styles.subHeader}>Work Experience</Text>

            <View style={styles.experienceItem}>
              <Text style={styles.jobTitle}>
                Senior Software Engineer
              </Text>
              <Text style={styles.company}>Tech Company Inc.</Text>
              <Text style={styles.date}>Jan 2020 - Present</Text>
              <Text style={styles.description}>
                • Led development of multiple full-stack applications
                {'\n'}• Mentored junior developers and conducted code
                reviews{'\n'}• Implemented CI/CD pipelines and
                improved deployment processes
              </Text>
            </View>

            <View style={styles.experienceItem}>
              <Text style={styles.jobTitle}>Software Developer</Text>
              <Text style={styles.company}>
                Digital Solutions Ltd.
              </Text>
              <Text style={styles.date}>Jun 2017 - Dec 2019</Text>
              <Text style={styles.description}>
                • Developed and maintained client-facing applications
                {'\n'}• Collaborated with cross-functional teams{'\n'}
                • Optimized application performance
              </Text>
            </View>
          </View>

          {/* Education */}
          <View style={styles.section}>
            <Text style={styles.subHeader}>Education</Text>
            <Text style={styles.jobTitle}>
              Bachelor of Science in Computer Science
            </Text>
            <Text style={styles.company}>University Name</Text>
            <Text style={styles.date}>2013 - 2017</Text>
          </View>

          {/* Skills */}
          <View style={styles.section}>
            <Text style={styles.subHeader}>Skills</Text>
            <View style={styles.skillsContainer}>
              {[
                'React',
                'Node.js',
                'TypeScript',
                'AWS',
                'Docker',
                'Git',
                'Agile',
              ].map((skill) => (
                <Text key={skill} style={styles.skill}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default Resume;
