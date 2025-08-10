import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { auth } from '@clerk/nextjs/server'
import { MongoClient } from 'mongodb';

const summarizedCurriculum = {
  anim: "The animation curriculum is a comprehensive course designed to build both foundational and advanced skills in 2D and 3D animation. The program begins with the principles of animation, emphasizing concepts like motion, timing, and character design. Students are introduced to industry-standard tools such as Adobe After-Effects, Blender, and Character Animator. They explore techniques for creating dynamic motion graphics, adding sound effects, and developing visual effects like particle simulations (e.g., fire, smoke). The course includes real-time character puppeteering, advanced rigging, facial animation, and physics-based effects. Learners also delve into Blender's 3D modeling and animation workflows. The curriculum emphasizes storytelling, multi-character interactions, and rendering optimization. A capstone project enables students to apply their skills in creating an animated short film or portfolio piece. Additionally, best practices in animation history, iterative storyboarding, and teamwork are embedded throughout, preparing students for careers in film, gaming, and digital media.",
  
  da: "The Data Analysis and Visualization curriculum focuses on equipping learners with the tools and techniques needed to extract insights from data and communicate them effectively. The course begins with foundational concepts, such as data wrangling, cleaning, and preprocessing. Learners gain proficiency in Python, Excel, and Power BI, enabling them to analyze datasets and create visualizations. Key skills include exploratory data analysis, statistical techniques like correlation and hypothesis testing, and advanced data visualization using libraries such as Matplotlib and Seaborn. The curriculum also covers specialized topics like time series forecasting, text analysis, dimensionality reduction, and clustering. Students are introduced to machine learning for data analysis and trained to build predictive models and evaluate them. A strong emphasis is placed on storytelling with data, teaching learners to present insights through dashboards and reports. The course culminates in a capstone project where students apply their skills to a real-world dataset.",
  
  gd: "The Game Development curriculum provides a holistic introduction to the gaming industry, covering design principles, programming, and project management. The program begins with an overview of popular game engines like Unity and Unreal Engine and foundational programming in C++ and JavaScript. Students learn to design game mechanics, create characters, and build immersive environments for 2D and 3D games. They work on interactive projects like platformers, first-person shooters, and tower defense games, exploring user interface design and AR/VR integration. Advanced topics include implementing AI for dynamic gameplay, monetization strategies, and optimizing performance. The course emphasizes real-world collaboration, encouraging learners to work in teams, simulate industry workflows, and manage development pipelines. By the end, students will have completed a capstone project showcasing a fully functional game, demonstrating their understanding of mechanics, physics, and player engagement. This curriculum prepares students for roles in game design, programming, and creative direction.",
  
  cc: "The Cloud Computing curriculum equips learners with the skills to design, deploy, and manage cloud-based solutions. The program begins with an introduction to cloud concepts, exploring the evolution, benefits, and challenges of cloud computing. Students gain hands-on experience with industry-leading platforms like AWS and Google Cloud, learning to utilize services such as compute, storage, and networking. The curriculum emphasizes Linux administration, version control with Git, and scripting with Bash for automating tasks. Learners are introduced to containerization using Docker and Kubernetes, enabling them to build and orchestrate scalable applications. Topics like configuration management with Ansible, cloud security, and monitoring are also covered. Real-world scenarios such as setting up firewalls, SSL certificates, and secure databases are explored. The course culminates in a capstone project where students design and deploy a cloud-based application. This curriculum prepares learners for careers in cloud engineering, DevOps, and IT infrastructure management.",
  
  devops: "The DevOps curriculum is designed to bridge the gap between development and operations, fostering a culture of collaboration and automation. It starts with the foundational principles of DevOps, emphasizing agility, continuous delivery, and integration. Students gain hands-on experience with tools like Git for version control, Kubernetes for container orchestration, and Docker for building containerized applications. The course introduces infrastructure as code (IaC) using Ansible, automating deployment processes, and managing configurations. Key topics include setting up CI/CD pipelines, monitoring and logging systems, and deploying scalable microservices architectures. Learners also explore advanced strategies such as blue-green and canary deployments to ensure seamless production updates. The program emphasizes real-world collaboration through group projects, simulating DevOps workflows. A final capstone project allows students to build and deploy an end-to-end pipeline. Graduates are prepared for roles as DevOps engineers, cloud architects, and site reliability engineers.",
  
  ai: "The AI and Machine Learning curriculum offers a deep dive into the rapidly evolving field of artificial intelligence. The course begins with an introduction to AI concepts, including supervised, unsupervised, and reinforcement learning. Learners gain proficiency in Python and its libraries, such as TensorFlow, Scikit-learn, and PyTorch, for building machine learning models. Key topics include data preprocessing, regression, clustering, sentiment analysis, and neural network architectures. Students explore real-world applications in computer vision, natural language processing, and business intelligence. Ethical considerations, model evaluation, and deployment techniques are integral to the curriculum. Hands-on projects include building predictive models, deploying web apps, and solving case studies in healthcare, finance, and other domains. The program culminates in a capstone project where students collaborate on an AI solution, preparing them for careers in data science, AI research, and software engineering.",
  
  sd: "The Software Development curriculum provides a comprehensive foundation in programming and application development. Starting with basic programming concepts in Python and JavaScript, learners progress to object-oriented programming (OOP) and full-stack web development. The course covers essential web technologies, including HTML, CSS, and JavaScript, and dives into asynchronous programming, data structures, and responsive design. Students also learn server-side development with Node.js and database integration. Emphasis is placed on software testing methodologies, quality assurance, and debugging. The curriculum includes exposure to the software development lifecycle (SDLC) and Agile methodologies. By the end of the program, learners complete a capstone project where they design, build, and deploy a software application. This curriculum prepares participants for roles in front-end, back-end, or full-stack development, equipping them with the skills to navigate the dynamic tech industry.",
  
  cyber: "The Cybersecurity curriculum is designed to address the growing demand for skilled professionals in digital security. The course begins with foundational principles, introducing learners to the threat landscape, risks, and vulnerabilities in digital ecosystems. Students gain expertise in network security, incident response, and secure system design. Key topics include intrusion prevention, monitoring, and analyzing network traffic. Practical exercises with tools like firewalls and intrusion detection systems are integral. The course also emphasizes ethical considerations, ensuring learners understand the importance of integrity and compliance in cybersecurity practices. Advanced topics include secure network design, threat analysis, and case studies on real-world breaches. A final capstone project involves creating a comprehensive cybersecurity plan. Graduates are equipped to take on roles in network security, ethical hacking, and information security management.",
  
  uiux: "The Product Design UI/UX curriculum focuses on creating user-centered designs that prioritize functionality and aesthetic appeal. The program begins with the principles of design, emphasizing balance, contrast, typography, and color theory. Learners delve into human-centered design, including empathy mapping and accessibility. Practical sessions in wireframing, prototyping, and usability testing are complemented by workshops on design thinking. Students are trained to use industry-standard tools such as Figma, Adobe XD, and InVision. Advanced topics include user research methods, data visualization, and storytelling with data. The curriculum culminates in a portfolio development module and a capstone project where learners create a complete digital product. By the end of the course, students are well-equipped to excel in roles as UI/UX designers, product managers, and digital strategists.",
  
  qa: "The Quality Assurance curriculum equips learners with the skills to ensure the quality and reliability of software products. Starting with the fundamentals of QA, the program explores test planning, documentation, and execution. Students are trained in both functional and non-functional testing, including performance and security testing. The course introduces automation tools and practices, enabling learners to streamline testing processes. Emphasis is placed on defect management, quality metrics, and continuous integration within Agile and DevOps environments. Advanced topics include emerging QA trends and their impact on software development. A final capstone project allows learners to apply QA methodologies to a real-world software product. This curriculum prepares graduates for roles as QA engineers, software testers, and test automation specialists.",

  ds : "This document outlines a comprehensive data science curriculum spanning twelve weeks. The course aims to equip students with both theoretical knowledge and practical skills in data analysis, machine learning, and artificial intelligence. Skillsets and Learnings: The curriculum progresses systematically, starting with foundational programming skills in Python and building up to advanced techniques. Specific skills acquired include: Programming: Proficiency in Python programming, including data structures lists, tuples, dictionaries, sets, conditional statements, loops, functions, and advanced techniques like list comprehensions. The use of libraries like Pandas, NumPy, SciPy, Matplotlib, Seaborn, BeautifulSoup, Scikit-learn, and TensorFlow is also covered. Data Analysis: Students will master data cleaning, wrangling, and imputation. This includes handling missing values, outlier detection, data transformation, and applying statistical analysis techniques mean, median, standard deviation, correlation, hypothesis testing, etc. Exploratory Data Analysis EDA will be a significant focus. Data Visualization: Students will learn to create compelling visualizations using Python libraries Matplotlib, Seaborn and Power BI to effectively communicate insights from data. Theyll master storytelling with data and create interactive dashboards. Data Sourcing: Techniques for sourcing data from various platforms will be taught, including web scraping BeautifulSoup, API calls OpenWeather API, and working with databases. Data integration techniques will also be covered. Machine Learning: The course introduces fundamental machine learning concepts, focusing on model training, evaluation, and the application of various models in real-world scenarios. This will involve using scikit-learn and TensorFlow. Statistical Reasoning: A strong understanding of statistical concepts and their practical application within the context of data analysis will be developed. Problem-solving and Algorithm Design: Students will hone their problem-solving abilities through algorithm design and optimization exercises. Collaboration and Communication: The curriculum emphasizes collaborative projects, enabling students to develop teamwork skills and effective communication of data analysis findings. Professional Development: The course concludes with career preparation focusing on resume writing, interview skills, and job application strategies. Course Structure: The course is structured around weekly modules, each with specific learning objectives, assignments, and assessments. The final week culminates in a capstone project where students integrate their learned skills. The curriculum makes extensive use of online resources like Coursera and provides supplementary materials like articles and links to various datasets.",
  pm : "This Harmonized Product Management Curriculum from 3MTT's Applied Learning Cluster aims to build product management expertise and confidence. The curriculum uses best practices like fostering interactive learning environments, providing scaffolding and support, encouraging reflection and adaptation, and highlighting real-world application. Throughout the course, fellows will understand the multifaceted role of a product manager, develop skills in reflective writing, critical thinking, and role analysis, analyze real-world case studies, and explore various industries for product managers. They will solidify their understanding of the product development life cycle, enhance problem-solving skills, identify and map comprehensive skill sets required for a product manager, and foster collaborative learning. Fellows will initiate and strategically plan projects, enhance their understanding and application of essential product manager skills, and develop and refine professional profiles. They will deepen their strategic understanding of product management, master product discovery processes, and initiate the creation of a comprehensive product portfolio. The curriculum also emphasizes mastering wireframing and user flow creation, strategically planning for product launch, effectively compiling and presenting a product portfolio, and fostering self-awareness and personal development. Fellows will develop an MVP for a hypothetical product, create a PRD for a dream product, highlight key skills and strengths, conduct a product teardown analysis, and create a comprehensive PRD for a social networking app. They will understand the importance of stakeholder management in Agile projects, learn to articulate skills and experiences, gain practical experience in Agile project management, and understand the role of user stories in product development. Prototyping skills will be developed and professional profiles refined, alongside crafting comprehensive product release notes and applying knowledge to real-world scenarios. The curriculum includes mastering prototyping with Figma, conducting thorough product teardowns, developing and presenting a compelling product portfolio, and collaborating on final projects. Fellows will enhance prototyping and user testing skills, showcase professional branding and networking, culminate capstone project work, and prepare for product management interviews. They will explore the challenges and opportunities in FinTech product management, analyze and deconstruct a product, develop a collaborative platform, prepare for product management interviews, and update professional branding materials. The program concludes with mastering interview techniques, finalizing and presenting capstone projects, developing and refining professional portfolios, and strategizing for job application success. This comprehensive curriculum ensures fellows gain hands-on experience in key product management activities, from MVP planning to PRD creation and product analysis, preparing them for successful careers in product management. Key skills developed include reflective writing, critical thinking, role analysis, problem-solving, strategic planning, stakeholder management, Agile methodologies, prototyping, user interface design, user testing, and professional branding and networking.",

};


const uri = process.env.MONGODB_URI; // MongoDB connection string
const client = new MongoClient(uri as string);
const GEMINI_API_KEY = process.env.API_KEY_GEMINI;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const mcqSchema = {
  description: "List of multiple-choice questions",
  type: "array", // Assuming SchemaType constants resolve to standard types
  items: {
    type: "object",
    properties: {
      question_text: {
        type: "string",
        description: "The question text",
        nullable: false, // You can omit this if the platform uses JSON Schema where 'nullable: false' is default
      },
      options: {
        type: "array",
        description: "Possible options",
        items: {
          type: "string", // Each option should be a string
        },
        nullable: false,
      },
      correct_answer: {
        type: "string",
        description: "The correct answer",
        nullable: false,
      },
    },
    required: ["question_text", "options", "correct_answer"],
  },
};

const modelStructuredOutput = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: mcqSchema,
  }
});

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth(); // Get the logged-in user's ID
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Parse the form data
    const formData = await req.json();
    // console.log(formData);

    if (!formData) {
      return NextResponse.json(
        { error: 'No json is passed' },
        { status: 400 }
      );
    }
    
    const result = await modelStructuredOutput.generateContent([
      { text: `Given the career: ${formData.course} and the user self ratings: ${JSON.stringify(formData.ratings)}, generate 10 MCQ questins to test the user on the career. The curriculum for the chosen career is ${summarizedCurriculum[formData.course]}`},
    ]);
    const mcqQuestions = JSON.parse(result.response.text());
    // console.log(mcqQuestions);

    // console.log('Extracted Text:', resumeParseText);
    // const skillsJsonText = await modelStructuredOutput.generateContent([{text: `Take the following and extract all the skills mentioned here ${resumeParseText}`}])
    // const skillsJson = JSON.parse(skillsJsonText.response.text())
    // console.log('Extracted Text:', skillsJson);

    // const topSkills = await modelStructuredOutput.generateContent([{text: `Take the following and extract top skills which are represntive of most of these. Extract some 5-10 represntitive skills. ${resumeParseText}`}]);
    // const topSkillsJson = JSON.parse(topSkills.response.text());

    // await client.connect();
    // const db = client.db('myDatabase'); // Replace with your DB name
    // const collection = db.collection('recipes'); // Replace with your collection name

    // await collection.updateOne(
    //   { user_id : userId },
    //   { $set: { skills_extracted: skillsJson,
    //     'user_actions.skills_extracted': true,
    //     top_skills: topSkillsJson
    //    } },
    //   { upsert: false } // Create the document if it doesn't exist
    // );
    
    return NextResponse.json({
      message: 'File uploaded and processed successfully!',
      mcqQuestions
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the file.' },
      { status: 500 }
    );
  }
};