const getSectionRenderOrder = (cvData) => {
  return (
    cvData.sectionOrder || [
      "personalInfo",
      "skills",
      "workExperience",
      "education",
      "projects",
      "awards",
    ]
  );
};

const renderTechStack = (techStack, color) => {
  if (!techStack || techStack.length === 0) return null;
  return (
    <div className="mt-2">
      <p className="text-xs font-semibold text-gray-600 mb-1">Tech Stack:</p>
      <div className="flex flex-wrap gap-1">
        {techStack.map((tech, idx) => (
          <span
            key={idx}
            className="text-xs px-2 py-0.5 rounded"
            style={{ backgroundColor: `${color}15`, color: color }}
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};



const CVTemplateRenderer = ({
  cvData,
  templateId,
  primaryColor = "#0EA5E9", // Using Simplify's primary color
  fontFamily = "font-sans",
}) => {
  const {
    ModernTemplate,
    SidebarTemplate,
    MinimalTemplate,
    ExecutiveTemplate,
    CreativeTemplate,
    TimelineTemplate,
    CompactTemplate,
    AcademicTemplate,
    TechnicalTemplate,
    ElegantTemplate,
  } = {
    ModernTemplate: ({ cvData, color, font }) => {
      const {
        personalInfo,
        skills,
        workExperience,
        education,
        projects,
        awards,
        sectionVisibility,
      } = cvData;
      const sectionOrder = getSectionRenderOrder(cvData);

      const sections = {
        personalInfo: sectionVisibility.personalInfo && (
          <header
            key="personalInfo"
            className="text-center mb-8 pb-6 border-b-2"
            style={{ borderColor: color }}
          >
            <h1 className="text-5xl font-bold mb-2" style={{ color }}>
              {personalInfo.name}
            </h1>
            <p className="text-xl text-gray-700 mb-3">{personalInfo.title}</p>
            <div className="text-sm text-gray-600 space-x-3">
              <span>{personalInfo.email}</span>
              <span>•</span>
              <span>{personalInfo.phone}</span>
              <span>•</span>
              <span>{personalInfo.address}</span>
            </div>
          </header>
        ),
        skills: sectionVisibility.skills && skills.length > 0 && (
          <section key="skills" className="mb-6">
            <h2
              className="text-2xl font-bold mb-3 pb-2 border-b-2"
              style={{ color, borderColor: color }}
            >
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-sm font-medium print-color"
                  style={{ backgroundColor: `${color}20`, color }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        ),
        workExperience: sectionVisibility.workExperience &&
          workExperience.length > 0 && (
            <section key="workExperience" className="mb-6">
              <h2
                className="text-2xl font-bold mb-3 pb-2 border-b-2"
                style={{ color, borderColor: color }}
              >
                Work Experience
              </h2>
              {workExperience.map((work) => (
                <div key={work.id} className="mb-4">
                  <h3 className="text-lg font-semibold">{work.position}</h3>
                  <p className="text-md font-medium" style={{ color }}>
                    {work.company}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {work.startDate} - {work.endDate}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {work.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ),
        projects: sectionVisibility.projects && projects.length > 0 && (
          <section key="projects" className="mb-6">
            <h2
              className="text-2xl font-bold mb-3 pb-2 border-b-2"
              style={{ color, borderColor: color }}
            >
              Projects
            </h2>
            {projects.map((project) => (
              <div key={project.id} className="mb-4">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {project.startDate} - {project.endDate}
                </p>
                <p className="text-gray-700 mb-2">{project.description}</p>
                {project.responsibilities &&
                  project.responsibilities.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {project.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  )}
                {renderTechStack(project.techStack, color)}
              </div>
            ))}
          </section>
        ),
        education: sectionVisibility.education && education.length > 0 && (
          <section key="education" className="mb-6">
            <h2
              className="text-2xl font-bold mb-3 pb-2 border-b-2"
              style={{ color, borderColor: color }}
            >
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <h3 className="text-lg font-semibold">{edu.institution}</h3>
                <p className="text-md">{edu.degree}</p>
                <p className="text-sm text-gray-500">
                  {edu.startDate} - {edu.endDate} | GPA: {edu.gpa}
                </p>
              </div>
            ))}
          </section>
        ),
        awards: sectionVisibility.awards && awards.length > 0 && (
          <section key="awards" className="mb-6">
            <h2
              className="text-2xl font-bold mb-3 pb-2 border-b-2"
              style={{ color, borderColor: color }}
            >
              Awards
            </h2>
            {awards.map((award) => (
              <div key={award.id} className="mb-2">
                <span className="font-semibold">{award.title}</span>
                <span className="text-gray-500"> ({award.date})</span>
                <p className="text-gray-700 text-sm">{award.description}</p>
              </div>
            ))}
          </section>
        ),
      };

      return (
        <div className={`p-8 bg-white ${font}`} style={{ minHeight: "297mm" }}>
          {sectionOrder.map((sectionKey) => sections[sectionKey])}
        </div>
      );
    },
    SidebarTemplate: ({ cvData, color, font }) => {
      const {
        personalInfo,
        skills,
        workExperience,
        education,
        projects,
        awards,
        sectionVisibility,
      } = cvData;
      const sectionOrder = getSectionRenderOrder(cvData);

      // Sidebar sections (personalInfo, skills, education go in sidebar)
      const sidebarSections = {
        personalInfo: sectionVisibility.personalInfo && (
          <div key="personalInfo" className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{personalInfo.name}</h1>
            <p className="text-lg mb-4 opacity-90">{personalInfo.title}</p>
            <div className="text-sm space-y-2 opacity-90">
              <p>{personalInfo.email}</p>
              <p>{personalInfo.phone}</p>
              <p>{personalInfo.address}</p>
            </div>
          </div>
        ),
        skills: sectionVisibility.skills && skills.length > 0 && (
          <div key="skills" className="mb-6">
            <h2 className="text-xl font-bold mb-3 pb-2 border-b border-white border-opacity-30">
              Skills
            </h2>
            <div className="space-y-2">
              {skills.map((skill, idx) => (
                <div key={idx} className="text-sm py-1">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        ),
        education: sectionVisibility.education && education.length > 0 && (
          <div key="education" className="mb-6">
            <h2 className="text-xl font-bold mb-3 pb-2 border-b border-white border-opacity-30">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3 text-sm">
                <p className="font-semibold">{edu.degree}</p>
                <p className="opacity-90">{edu.institution}</p>
                <p className="text-xs opacity-80">
                  {edu.startDate} - {edu.endDate}
                </p>
                <p className="text-xs opacity-90">GPA: {edu.gpa}</p>
              </div>
            ))}
          </div>
        ),
      };

      // Main content sections (workExperience, projects, awards)
      const mainSections = {
        workExperience: sectionVisibility.workExperience &&
          workExperience.length > 0 && (
            <section key="workExperience" className="mb-6">
              <h2
                className="text-2xl font-bold mb-4 pb-2 border-b-2"
                style={{ color, borderColor: color }}
              >
                Work Experience
              </h2>
              {workExperience.map((work) => (
                <div key={work.id} className="mb-5">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {work.position}
                  </h3>
                  <p className="text-md font-medium" style={{ color }}>
                    {work.company}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {work.startDate} - {work.endDate}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {work.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ),
        projects: sectionVisibility.projects && projects.length > 0 && (
          <section key="projects" className="mb-6">
            <h2
              className="text-2xl font-bold mb-4 pb-2 border-b-2"
              style={{ color, borderColor: color }}
            >
              Projects
            </h2>
            {projects.map((project) => (
              <div key={project.id} className="mb-5">
                <h3 className="text-lg font-semibold text-gray-900">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  {project.startDate} - {project.endDate}
                </p>
                <p className="text-gray-700 mb-2">{project.description}</p>
                {project.responsibilities &&
                  project.responsibilities.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      {project.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  )}
                {renderTechStack(project.techStack, color)}
              </div>
            ))}
          </section>
        ),
        awards: sectionVisibility.awards && awards.length > 0 && (
          <section key="awards" className="mb-6">
            <h2
              className="text-2xl font-bold mb-4 pb-2 border-b-2"
              style={{ color, borderColor: color }}
            >
              Awards
            </h2>
            {awards.map((award) => (
              <div key={award.id} className="mb-3">
                <span className="font-semibold text-gray-900">
                  {award.title}
                </span>
                <span className="text-gray-500"> ({award.date})</span>
                <p className="text-gray-700 text-sm">{award.description}</p>
              </div>
            ))}
          </section>
        ),
      };

      const sidebarKeys = ["personalInfo", "skills", "education"];
      const mainKeys = ["workExperience", "projects", "awards"];

      return (
        <div className={`flex ${font}`} style={{ minHeight: "297mm" }}>
          <div
            className="w-1/3 p-6 text-white print-bg"
            style={{ backgroundColor: color }}
          >
            {sectionOrder
              .filter((key) => sidebarKeys.includes(key))
              .map((key) => sidebarSections[key])}
          </div>

          <div className="w-2/3 p-8 bg-white">
            {sectionOrder
              .filter((key) => mainKeys.includes(key))
              .map((key) => mainSections[key])}
          </div>
        </div>
      );
    },
    MinimalTemplate: ({ cvData, color, font }) => {
      const {
        personalInfo,
        skills,
        workExperience,
        education,
        projects,
        awards,
        sectionVisibility,
      } = cvData;
      const sectionOrder = getSectionRenderOrder(cvData);

      const sections = {
        personalInfo: sectionVisibility.personalInfo && (
          <header key="personalInfo" className="mb-8">
            <h1 className="text-6xl font-light mb-1" style={{ color }}>
              {personalInfo.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{personalInfo.title}</p>
            <div className="text-sm text-gray-500 flex gap-4">
              <span>{personalInfo.email}</span>
              <span>{personalInfo.phone}</span>
              <span>{personalInfo.address}</span>
            </div>
          </header>
        ),
        skills: sectionVisibility.skills && skills.length > 0 && (
          <section key="skills" className="mb-8">
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-4"
              style={{ color }}
            >
              Skills
            </h2>
            <p className="text-gray-700">{skills.join(" • ")}</p>
          </section>
        ),
        workExperience: sectionVisibility.workExperience &&
          workExperience.length > 0 && (
            <section key="workExperience" className="mb-8">
              <h2
                className="text-sm font-bold uppercase tracking-wider mb-4"
                style={{ color }}
              >
                Experience
              </h2>
              {workExperience.map((work) => (
                <div key={work.id} className="mb-5">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-semibold">{work.position}</h3>
                    <span className="text-sm text-gray-500">
                      {work.startDate} - {work.endDate}
                    </span>
                  </div>
                  <p className="text-md text-gray-700 mb-2">{work.company}</p>
                  <ul className="list-none text-gray-600 space-y-1 text-sm">
                    {work.responsibilities.map((resp, idx) => (
                      <li key={idx}>• {resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ),
        projects: sectionVisibility.projects && projects.length > 0 && (
          <section key="projects" className="mb-8">
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-4"
              style={{ color }}
            >
              Projects
            </h2>
            {projects.map((project) => (
              <div key={project.id} className="mb-5">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <span className="text-sm text-gray-500">
                    {project.startDate} - {project.endDate}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {project.description}
                </p>
                {project.responsibilities &&
                  project.responsibilities.length > 0 && (
                    <ul className="list-none text-gray-600 space-y-1 text-sm">
                      {project.responsibilities.map((resp, idx) => (
                        <li key={idx}>• {resp}</li>
                      ))}
                    </ul>
                  )}
                {renderTechStack(project.techStack, color)}
              </div>
            ))}
          </section>
        ),
        education: sectionVisibility.education && education.length > 0 && (
          <section key="education" className="mb-8">
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-4"
              style={{ color }}
            >
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-lg font-semibold">{edu.degree}</h3>
                    <p className="text-md text-gray-700">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
              </div>
            ))}
          </section>
        ),
        awards: sectionVisibility.awards && awards.length > 0 && (
          <section key="awards" className="mb-8">
            <h2
              className="text-sm font-bold uppercase tracking-wider mb-4"
              style={{ color }}
            >
              Awards
            </h2>
            {awards.map((award) => (
              <div key={award.id} className="mb-2">
                <span className="font-semibold">{award.title}</span>
                <span className="text-gray-500 text-sm"> — {award.date}</span>
                <p className="text-gray-600 text-sm">{award.description}</p>
              </div>
            ))}
          </section>
        ),
      };

      return (
        <div className={`p-12 bg-white ${font}`} style={{ minHeight: "297mm" }}>
          {sectionOrder.map((sectionKey) => sections[sectionKey])}
        </div>
      );
    },
    ExecutiveTemplate: ({ cvData, color, font }) => {
      const {
        personalInfo,
        skills,
        workExperience,
        education,
        projects,
        awards,
        sectionVisibility,
      } = cvData;
      const sectionOrder = getSectionRenderOrder(cvData);

      const sections = {
        personalInfo: sectionVisibility.personalInfo && (
          <header
            key="personalInfo"
            className="text-center mb-6 pb-4 border-b-4 border-gray-800"
          >
            <h1
              className="text-4xl font-bold mb-1 tracking-wide uppercase"
              style={{ color }}
            >
              {personalInfo.name}
            </h1>
            <p className="text-lg text-gray-700 mb-2">{personalInfo.title}</p>
            <div className="text-xs text-gray-600 space-x-3">
              <span>{personalInfo.email}</span>
              <span>|</span>
              <span>{personalInfo.phone}</span>
              <span>|</span>
              <span>{personalInfo.address}</span>
            </div>
          </header>
        ),
        skills: sectionVisibility.skills && skills.length > 0 && (
          <section key="skills" className="mb-6">
            <h2 className="text-xl font-bold uppercase tracking-wide mb-3 pb-1 border-b-2 border-gray-300">
              Core Skills
            </h2>
            <div className="space-y-1">
              {skills.map((skill, idx) => (
                <div key={idx} className="text-sm text-gray-700">
                  • {skill}
                </div>
              ))}
            </div>
          </section>
        ),
        workExperience: sectionVisibility.workExperience &&
          workExperience.length > 0 && (
            <section key="workExperience" className="mb-6">
              <h2 className="text-xl font-bold uppercase tracking-wide mb-3 pb-1 border-b-2 border-gray-300">
                Professional Experience
              </h2>
              {workExperience.map((work) => (
                <div key={work.id} className="mb-4">
                  <h3 className="text-md font-bold">{work.position}</h3>
                  <p className="text-sm font-semibold text-gray-700">
                    {work.company} | {work.startDate} - {work.endDate}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 mt-2">
                    {work.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ),
        projects: sectionVisibility.projects && projects.length > 0 && (
          <section key="projects" className="mb-6">
            <h2 className="text-xl font-bold uppercase tracking-wide mb-3 pb-1 border-b-2 border-gray-300">
              Key Projects
            </h2>
            {projects.map((project) => (
              <div key={project.id} className="mb-4">
                <h3 className="text-md font-bold">{project.title}</h3>
                <p className="text-sm text-gray-600">
                  {project.startDate} - {project.endDate}
                </p>
                <p className="text-gray-700 text-sm mt-1">
                  {project.description}
                </p>
                {project.responsibilities &&
                  project.responsibilities.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 mt-1">
                      {project.responsibilities.map((resp, idx) => (
                        <li key={idx}>{resp}</li>
                      ))}
                    </ul>
                  )}
                {renderTechStack(project.techStack, color)}
              </div>
            ))}
          </section>
        ),
        education: sectionVisibility.education && education.length > 0 && (
          <section key="education" className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wide mb-3 pb-1 border-b-2 border-gray-300">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3 text-sm">
                <p className="font-bold">{edu.degree}</p>
                <p className="text-gray-700">{edu.institution}</p>
                <p className="text-gray-600 text-xs">
                  {edu.startDate} - {edu.endDate}
                </p>
                <p className="text-gray-600 text-xs">GPA: {edu.gpa}</p>
              </div>
            ))}
          </section>
        ),
        awards: sectionVisibility.awards && awards.length > 0 && (
          <section key="awards" className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-wide mb-3 pb-1 border-b-2 border-gray-300">
              Honors
            </h2>
            {awards.map((award) => (
              <div key={award.id} className="mb-2 text-sm">
                <p className="font-semibold">{award.title}</p>
                <p className="text-gray-600 text-xs">{award.date}</p>
              </div>
            ))}
          </section>
        ),
      };

      return (
        <div className={`p-8 bg-white ${font}`} style={{ minHeight: "297mm" }}>
          {sectionOrder.map((sectionKey) => sections[sectionKey])}
        </div>
      );
    },
    CreativeTemplate: ({ cvData, color, font }) => {
      const {
        personalInfo,
        skills,
        workExperience,
        education,
        projects,
        awards,
        sectionVisibility,
      } = cvData;
      const sectionOrder = getSectionRenderOrder(cvData);

      const sections = {
        personalInfo: sectionVisibility.personalInfo && (
          <header
            key="personalInfo"
            className="p-8 text-white print-bg"
            style={{ backgroundColor: color }}
          >
            <h1 className="text-5xl font-bold mb-2">{personalInfo.name}</h1>
            <p className="text-2xl mb-4 opacity-90">{personalInfo.title}</p>
            <div className="text-sm opacity-80 space-x-3">
              <span>{personalInfo.email}</span>
              <span>•</span>
              <span>{personalInfo.phone}</span>
              <span>•</span>
              <span>{personalInfo.address}</span>
            </div>
          </header>
        ),
        skills: sectionVisibility.skills && skills.length > 0 && (
          <section key="skills" className="mb-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color }}>
              Skills & Expertise
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-2 border-l-4 text-sm font-medium print-color"
                  style={{ borderColor: color }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </section>
        ),
        workExperience: sectionVisibility.workExperience &&
          workExperience.length > 0 && (
            <section key="workExperience" className="mb-6">
              <h2 className="text-2xl font-bold mb-4" style={{ color }}>
                Experience
              </h2>
              {workExperience.map((work) => (
                <div
                  key={work.id}
                  className="mb-5 border-l-4 pl-4 print-color"
                  style={{ borderColor: color }}
                >
                  <h3 className="text-xl font-bold">{work.position}</h3>
                  <p className="text-lg font-semibold text-gray-700">
                    {work.company}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    {work.startDate} - {work.endDate}
                  </p>
                  <ul className="list-none text-gray-700 space-y-1">
                    {work.responsibilities.map((resp, idx) => (
                      <li
                        key={idx}
                        className="before:content-['▸'] before:mr-2 print-color"
                        style={{ color }}
                      >
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ),
        projects: sectionVisibility.projects && projects.length > 0 && (
          <section key="projects" className="mb-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color }}>
              Featured Projects
            </h2>
            <div className="grid gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 border-2 rounded-lg print-color"
                  style={{ borderColor: `${color}40` }}
                >
                  <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {project.startDate} - {project.endDate}
                  </p>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  {project.responsibilities &&
                    project.responsibilities.length > 0 && (
                      <ul className="list-none text-gray-700 space-y-1 text-sm">
                        {project.responsibilities.map((resp, idx) => (
                          <li
                            key={idx}
                            className="before:content-['▸'] before:mr-2 print-color"
                            style={{ color }}
                          >
                            {resp}
                          </li>
                        ))}
                      </ul>
                    )}
                  {renderTechStack(project.techStack, color)}
                </div>
              ))}
            </div>
          </section>
        ),
        education: sectionVisibility.education && education.length > 0 && (
          <section key="education" className="mb-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color }}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <h3 className="text-lg font-bold">{edu.degree}</h3>
                <p className="text-md text-gray-700">{edu.institution}</p>
                <p className="text-sm text-gray-500">
                  {edu.startDate} - {edu.endDate} | GPA: {edu.gpa}
                </p>
              </div>
            ))}
          </section>
        ),
        awards: sectionVisibility.awards && awards.length > 0 && (
          <section key="awards" className="mb-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color }}>
              Awards & Recognition
            </h2>
            {awards.map((award) => (
              <div key={award.id} className="mb-3">
                <p className="font-bold">{award.title}</p>
                <p className="text-sm text-gray-500">{award.date}</p>
                <p className="text-sm text-gray-700">{award.description}</p>
              </div>
            ))}
          </section>
        ),
      };

      const mainSections = sectionOrder.filter((key) => key !== "personalInfo");

      return (
        <div className={`${font}`} style={{ minHeight: "297mm" }}>
          {sections.personalInfo}
          <div className="p-8 bg-white">
            {mainSections.map((sectionKey) => sections[sectionKey])}
          </div>
        </div>
      );
    },
    TimelineTemplate: ({ cvData, color, font }) => {
      const {
        personalInfo,
        skills,
        workExperience,
        education,
        projects,
        awards,
        sectionVisibility,
      } = cvData;
      const sectionOrder = getSectionRenderOrder(cvData);

      const sections = {
        personalInfo: sectionVisibility.personalInfo && (
          <header key="personalInfo" className="mb-8">
            <h1 className="text-5xl font-bold mb-2" style={{ color }}>
              {personalInfo.name}
            </h1>
            <p className="text-xl text-gray-700 mb-3">{personalInfo.title}</p>
            <div className="text-sm text-gray-600 space-x-3">
              <span>{personalInfo.email}</span>
              <span>•</span>
              <span>{personalInfo.phone}</span>
              <span>•</span>
              <span>{personalInfo.address}</span>
            </div>
          </header>
        ),
        skills: sectionVisibility.skills && skills.length > 0 && (
          <section key="skills" className="mb-8">
            <h2 className="text-2xl font-bold mb-3" style={{ color }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        ),
        workExperience: sectionVisibility.workExperience &&
          workExperience.length > 0 && (
            <section key="workExperience" className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ color }}>
                Career Timeline
              </h2>
              <div
                className="border-l-4 pl-6 space-y-6 print-color"
                style={{ borderColor: color }}
              >
                {workExperience.map((work, idx) => (
                  <div key={work.id} className="relative">
                    <div
                      className="absolute -left-9 w-5 h-5 rounded-full border-4 bg-white print-color"
                      style={{ borderColor: color }}
                    ></div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-lg font-bold">{work.position}</h3>
                      <p
                        className="text-md font-semibold print-color"
                        style={{ color }}
                      >
                        {work.company}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        {work.startDate} - {work.endDate}
                      </p>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        {work.responsibilities.map((resp, idx) => (
                          <li key={idx}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ),
        projects: sectionVisibility.projects && projects.length > 0 && (
          <section key="projects" className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color }}>
              Projects Timeline
            </h2>
            <div
              className="border-l-4 pl-6 space-y-6 print-color"
              style={{ borderColor: color }}
            >
              {projects.map((project) => (
                <div key={project.id} className="relative">
                  <div
                    className="absolute -left-9 w-5 h-5 rounded-full border-4 bg-white print-color"
                    style={{ borderColor: color }}
                  ></div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-bold">{project.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {project.startDate} - {project.endDate}
                    </p>
                    <p className="text-gray-700 mb-2">{project.description}</p>
                    {project.responsibilities &&
                      project.responsibilities.length > 0 && (
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {project.responsibilities.map((resp, idx) => (
                            <li key={idx}>{resp}</li>
                          ))}
                        </ul>
                      )}
                    {renderTechStack(project.techStack, color)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ),
        education: sectionVisibility.education && education.length > 0 && (
          <section key="education" className="mb-6">
            <h2 className="text-xl font-bold mb-3" style={{ color }}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                <h3 className="font-bold">{edu.degree}</h3>
                <p className="text-sm text-gray-700">{edu.institution}</p>
                <p className="text-xs text-gray-500">
                  {edu.startDate} - {edu.endDate}
                </p>
                <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>
              </div>
            ))}
          </section>
        ),
        awards: sectionVisibility.awards && awards.length > 0 && (
          <section key="awards" className="mb-6">
            <h2 className="text-xl font-bold mb-3" style={{ color }}>
              Awards
            </h2>
            {awards.map((award) => (
              <div key={award.id} className="mb-3 p-3 bg-gray-50 rounded-lg">
                <p className="font-bold text-sm">{award.title}</p>
                <p className="text-xs text-gray-500">{award.date}</p>
                <p className="text-xs text-gray-700">{award.description}</p>
              </div>
            ))}
          </section>
        ),
      };

      return (
        <div className={`p-8 bg-white ${font}`} style={{ minHeight: "297mm" }}>
          {sectionOrder.map((sectionKey) => sections[sectionKey])}
        </div>
      );
    },
    CompactTemplate: ({ cvData, color, font }) => {
      const {
        personalInfo,
        skills,
        workExperience,
        education,
        projects,
        awards,
        sectionVisibility,
      } = cvData;
      const sectionOrder = getSectionRenderOrder(cvData);

      const sidebarSections = {
        personalInfo: sectionVisibility.personalInfo && (
          <header
            key="personalInfo"
            className="mb-4 pb-3 border-b-2"
            style={{ borderColor: color }}
          >
            <h1 className="text-3xl font-bold" style={{ color }}>
              {personalInfo.name}
            </h1>
            <p className="text-md text-gray-700">{personalInfo.title}</p>
            <div className="text-xs text-gray-600 mt-1">
              {personalInfo.email} | {personalInfo.phone} |{" "}
              {personalInfo.address}
            </div>
          </header>
        ),
        skills: sectionVisibility.skills && skills.length > 0 && (
          <section key="skills" className="mb-4">
            <h2 className="text-lg font-bold mb-2" style={{ color }}>
              Skills
            </h2>
            <div className="space-y-1">
              {skills.map((skill, idx) => (
                <div key={idx} className="text-xs">
                  {skill}
                </div>
              ))}
            </div>
          </section>
        ),
        education: sectionVisibility.education && education.length > 0 && (
          <section key="education" className="mb-4">
            <h2 className="text-lg font-bold mb-2" style={{ color }}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <p className="font-bold text-xs">{edu.degree}</p>
                <p className="text-xs text-gray-700">{edu.institution}</p>
                <p className="text-xs text-gray-500">
                  {edu.startDate} - {edu.endDate}
                </p>
                <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>
              </div>
            ))}
          </section>
        ),
      };

      const mainSections = {
        workExperience: sectionVisibility.workExperience &&
          workExperience.length > 0 && (
            <section key="workExperience" className="mb-4">
              <h2 className="text-lg font-bold mb-2" style={{ color }}>
                Experience
              </h2>
              {workExperience.map((work) => (
                <div key={work.id} className="mb-3">
                  <div className="flex justify-between">
                    <h3 className="font-bold">{work.position}</h3>
                    <span className="text-xs text-gray-500">
                      {work.startDate} - {work.endDate}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">
                    {work.company}
                  </p>
                  <ul className="list-disc list-inside text-xs space-y-0.5 mt-1">
                    {work.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ),
        projects: sectionVisibility.projects && projects.length > 0 && (
          <section key="projects" className="mb-4">
            <h2 className="text-lg font-bold mb-2" style={{ color }}>
              Projects
            </h2>
            {projects.map((project) => (
              <div key={project.id} className="mb-3">
                <div className="flex justify-between">
                  <h3 className="font-bold">{project.title}</h3>
                  <span className="text-xs text-gray-500">
                    {project.startDate} - {project.endDate}
                  </span>
                </div>
                <p className="text-xs mt-1">{project.description}</p>
                {renderTechStack(project.techStack, color)}
              </div>
            ))}
          </section>
        ),
        awards: sectionVisibility.awards && awards.length > 0 && (
          <section key="awards" className="mb-4">
            <h2 className="text-lg font-bold mb-2" style={{ color }}>
              Awards
            </h2>
            <div className="space-y-1">
              {awards.map((award) => (
                <div key={award.id}>
                  <span className="font-bold text-xs">{award.title}</span>
                  <span className="text-xs text-gray-500"> ({award.date})</span>
                </div>
              ))}
            </div>
          </section>
        ),
      };

      const sidebarKeys = ["personalInfo", "skills", "education"];
      const mainKeys = ["workExperience", "projects", "awards"];

      return (
        <div
          className={`p-6 bg-white ${font} text-sm`}
          style={{ minHeight: "297mm" }}
        >
          <div className="grid grid-cols-4 gap-4">
            <div>
              {sectionOrder
                .filter((key) => sidebarKeys.includes(key))
                .map((key) => sidebarSections[key])}
            </div>
            <div className="col-span-3">
              {sectionOrder
                .filter((key) => mainKeys.includes(key))
                .map((key) => mainSections[key])}
            </div>
          </div>
        </div>
      );
    },
    AcademicTemplate: ({ cvData, color, font }) => {
      const {
        personalInfo,
        skills,
        workExperience,
        education,
        projects,
        awards,
        sectionVisibility,
      } = cvData;
      const sectionOrder = getSectionRenderOrder(cvData);

      const sections = {
        personalInfo: sectionVisibility.personalInfo && (
          <header
            key="personalInfo"
            className="text-center mb-6 pb-4 border-b border-gray-400"
          >
            <h1 className="text-4xl font-bold mb-2">{personalInfo.name}</h1>
            <p className="text-lg text-gray-700 mb-2">{personalInfo.title}</p>
            <div className="text-sm text-gray-600">
              {personalInfo.email} • {personalInfo.phone} •{" "}
              {personalInfo.address}
            </div>
          </header>
        ),
        skills: sectionVisibility.skills && skills.length > 0 && (
          <section key="skills" className="mb-6">
            <h2 className="text-xl font-bold mb-3 uppercase">
              Skills & Competencies
            </h2>
            <p className="text-gray-700">{skills.join(", ")}</p>
          </section>
        ),
        workExperience: sectionVisibility.workExperience &&
          workExperience.length > 0 && (
            <section key="workExperience" className="mb-6">
              <h2 className="text-xl font-bold mb-3 uppercase">Experience</h2>
              {workExperience.map((work) => (
                <div key={work.id} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <h3 className="text-lg font-semibold">{work.position}</h3>
                    <span className="text-sm text-gray-600">
                      {work.startDate} - {work.endDate}
                    </span>
                  </div>
                  <p className="text-md text-gray-700 italic mb-2">
                    {work.company}
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {work.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ),
        projects: sectionVisibility.projects && projects.length > 0 && (
          <section key="projects" className="mb-6">
            <h2 className="text-xl font-bold mb-3 uppercase">
              Research & Projects
            </h2>
            {projects.map((project) => (
              <div key={project.id} className="mb-4">
                <div className="flex justify-between mb-1">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <span className="text-sm text-gray-600">
                    {project.startDate} - {project.endDate}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{project.description}</p>
                {renderTechStack(project.techStack, color)}
              </div>
            ))}
          </section>
        ),
        education: sectionVisibility.education && education.length > 0 && (
          <section key="education" className="mb-6">
            <h2 className="text-xl font-bold mb-3 uppercase">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{edu.degree}</h3>
                    <p className="text-md text-gray-700">{edu.institution}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {edu.startDate} - {edu.endDate}
                    </p>
                    <p className="text-sm font-semibold">GPA: {edu.gpa}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>
        ),
        awards: sectionVisibility.awards && awards.length > 0 && (
          <section key="awards" className="mb-6">
            <h2 className="text-xl font-bold mb-3 uppercase">
              Honors & Awards
            </h2>
            {awards.map((award) => (
              <div key={award.id} className="mb-2">
                <p className="font-semibold">
                  {award.title}{" "}
                  <span className="text-gray-600 font-normal">
                    ({award.date})
                  </span>
                </p>
                <p className="text-gray-700 text-sm">{award.description}</p>
              </div>
            ))}
          </section>
        ),
      };

      return (
        <div className={`p-10 bg-white ${font}`} style={{ minHeight: "297mm" }}>
          {sectionOrder.map((sectionKey) => sections[sectionKey])}
        </div>
      );
    },
    TechnicalTemplate: ({ cvData, color, font }) => {
      const {
        personalInfo,
        skills,
        workExperience,
        education,
        projects,
        awards,
        sectionVisibility,
      } = cvData;
      const sectionOrder = getSectionRenderOrder(cvData);

      const sections = {
        personalInfo: sectionVisibility.personalInfo && (
          <header
            key="personalInfo"
            className="bg-white p-6 rounded-lg shadow-sm mb-6"
          >
            <h1 className="text-4xl font-bold mb-2" style={{ color }}>
              {personalInfo.name}
            </h1>
            <p className="text-xl text-gray-700 mb-3">{personalInfo.title}</p>
            <div className="text-sm text-gray-600 font-mono">
              <span className="mr-4">📧 {personalInfo.email}</span>
              <span className="mr-4">📱 {personalInfo.phone}</span>
              <span>📍 {personalInfo.address}</span>
            </div>
          </header>
        ),
        skills: sectionVisibility.skills && skills.length > 0 && (
          <section
            key="skills"
            className="bg-white p-6 rounded-lg shadow-sm mb-6"
          >
            <h2 className="text-2xl font-bold mb-4 font-mono" style={{ color }}>
              // Technical Skills
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 bg-gray-100 rounded font-mono text-xs border-l-2 print-color"
                  style={{ borderColor: color }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </section>
        ),
        workExperience: sectionVisibility.workExperience &&
          workExperience.length > 0 && (
            <section
              key="workExperience"
              className="bg-white p-6 rounded-lg shadow-sm mb-6"
            >
              <h2
                className="text-2xl font-bold mb-4 font-mono"
                style={{ color }}
              >
                // Work Experience
              </h2>
              {workExperience.map((work) => (
                <div
                  key={work.id}
                  className="mb-5 pb-5 border-b border-gray-200 last:border-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold">{work.position}</h3>
                      <p className="text-md font-semibold text-gray-700">
                        {work.company}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 font-mono">
                      {work.startDate} - {work.endDate}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {work.responsibilities.map((resp, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        <span className="font-mono mr-2" style={{ color }}>
                          ›
                        </span>
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ),
        projects: sectionVisibility.projects && projects.length > 0 && (
          <section
            key="projects"
            className="bg-white p-6 rounded-lg shadow-sm mb-6"
          >
            <h2 className="text-2xl font-bold mb-4 font-mono" style={{ color }}>
              // Projects
            </h2>
            {projects.map((project) => (
              <div
                key={project.id}
                className="mb-5 pb-5 border-b border-gray-200 last:border-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold font-mono">
                    {project.title}
                  </h3>
                  <span className="text-sm text-gray-500 font-mono">
                    {project.startDate} - {project.endDate}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{project.description}</p>
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-800 text-white text-xs rounded font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        ),
        education: sectionVisibility.education && education.length > 0 && (
          <section
            key="education"
            className="bg-white p-6 rounded-lg shadow-sm mb-6"
          >
            <h2 className="text-xl font-bold mb-3 font-mono" style={{ color }}>
              // Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <h3 className="font-bold">{edu.degree}</h3>
                <p className="text-sm text-gray-700">{edu.institution}</p>
                <p className="text-xs text-gray-500 font-mono">
                  {edu.startDate} - {edu.endDate}
                </p>
                <p className="text-xs text-gray-600 font-mono">
                  GPA: {edu.gpa}
                </p>
              </div>
            ))}
          </section>
        ),
        awards: sectionVisibility.awards && awards.length > 0 && (
          <section
            key="awards"
            className="bg-white p-6 rounded-lg shadow-sm mb-6"
          >
            <h2 className="text-xl font-bold mb-3 font-mono" style={{ color }}>
              // Awards
            </h2>
            {awards.map((award) => (
              <div key={award.id} className="mb-3">
                <p className="font-bold text-sm">{award.title}</p>
                <p className="text-xs text-gray-500 font-mono">{award.date}</p>
              </div>
            ))}
          </section>
        ),
      };

      return (
        <div
          className={`p-8 bg-gray-50 ${font}`}
          style={{ minHeight: "297mm" }}
        >
          {sectionOrder.map((sectionKey) => sections[sectionKey])}
        </div>
      );
    },
    ElegantTemplate: ({ cvData, color, font }) => {
      const {
        personalInfo,
        skills,
        workExperience,
        education,
        projects,
        awards,
        sectionVisibility,
      } = cvData;
      const sectionOrder = getSectionRenderOrder(cvData);

      const sections = {
        personalInfo: sectionVisibility.personalInfo && (
          <header key="personalInfo" className="text-center mb-8">
            <h1 className="text-5xl font-serif mb-3" style={{ color }}>
              {personalInfo.name}
            </h1>
            <div
              className="w-24 h-1 mx-auto mb-4"
              style={{ backgroundColor: color }}
            ></div>
            <p className="text-xl text-gray-700 mb-3 italic">
              {personalInfo.title}
            </p>
            <div className="text-sm text-gray-600">
              {personalInfo.email} · {personalInfo.phone} ·{" "}
              {personalInfo.address}
            </div>
          </header>
        ),
        skills: sectionVisibility.skills && skills.length > 0 && (
          <section key="skills" className="mb-6">
            <div className="text-center mb-3">
              <h2
                className="text-xl font-serif inline-block px-4 py-1"
                style={{ color, borderBottom: `2px solid ${color}` }}
              >
                Skills
              </h2>
            </div>
            <div className="text-center">
              <p className="text-gray-700">{skills.join(" · ")}</p>
            </div>
          </section>
        ),
        workExperience: sectionVisibility.workExperience &&
          workExperience.length > 0 && (
            <section key="workExperience" className="mb-8">
              <div className="text-center mb-4">
                <h2
                  className="text-2xl font-serif inline-block px-6 py-2"
                  style={{ color, borderBottom: `2px solid ${color}` }}
                >
                  Professional Experience
                </h2>
              </div>
              {workExperience.map((work) => (
                <div key={work.id} className="mb-5">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-semibold">{work.position}</h3>
                    <span className="text-sm text-gray-500 italic">
                      {work.startDate} - {work.endDate}
                    </span>
                  </div>
                  <p className="text-md text-gray-700 mb-2 italic">
                    {work.company}
                  </p>
                  <ul className="list-none text-gray-700 space-y-1 pl-4">
                    {work.responsibilities.map((resp, idx) => (
                      <li
                        key={idx}
                        className="relative before:content-['◆'] before:absolute before:-left-4 before:text-xs print-color"
                        style={{ color }}
                      >
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          ),
        projects: sectionVisibility.projects && projects.length > 0 && (
          <section key="projects" className="mb-8">
            <div className="text-center mb-4">
              <h2
                className="text-2xl font-serif inline-block px-6 py-2"
                style={{ color, borderBottom: `2px solid ${color}` }}
              >
                Notable Projects
              </h2>
            </div>
            {projects.map((project) => (
              <div key={project.id} className="mb-5">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <span className="text-sm text-gray-500 italic">
                    {project.startDate} - {project.endDate}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{project.description}</p>
                {renderTechStack(project.techStack, color)}
              </div>
            ))}
          </section>
        ),
        education: sectionVisibility.education && education.length > 0 && (
          <section key="education" className="mb-6">
            <div className="text-center mb-3">
              <h2
                className="text-xl font-serif inline-block px-4 py-1"
                style={{ color, borderBottom: `2px solid ${color}` }}
              >
                Education
              </h2>
            </div>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3 text-center">
                <h3 className="font-semibold">{edu.degree}</h3>
                <p className="text-sm text-gray-700 italic">
                  {edu.institution}
                </p>
                <p className="text-xs text-gray-500">
                  {edu.startDate} - {edu.endDate}
                </p>
                <p className="text-xs text-gray-600">GPA: {edu.gpa}</p>
              </div>
            ))}
          </section>
        ),
        awards: sectionVisibility.awards && awards.length > 0 && (
          <section key="awards" className="mb-6">
            <div className="text-center mb-3">
              <h2
                className="text-xl font-serif inline-block px-4 py-1"
                style={{ color, borderBottom: `2px solid ${color}` }}
              >
                Honors & Awards
              </h2>
            </div>
            <div className="text-center">
              {awards.map((award) => (
                <div key={award.id} className="mb-2">
                  <span className="font-semibold">{award.title}</span>
                  <span className="text-gray-500 text-sm italic">
                    {" "}
                    — {award.date}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ),
      };

      return (
        <div className={`p-10 bg-white ${font}`} style={{ minHeight: "297mm" }}>
          {sectionOrder.map((sectionKey) => sections[sectionKey])}
        </div>
      );
    },
  };

  const templates = {
    modern: ModernTemplate,
    sidebar: SidebarTemplate,
    minimal: MinimalTemplate,
    executive: ExecutiveTemplate,
    creative: CreativeTemplate,
    timeline: TimelineTemplate,
    compact: CompactTemplate,
    academic: AcademicTemplate,
    technical: TechnicalTemplate,
    elegant: ElegantTemplate,
  };

  const Template = templates[templateId] || ModernTemplate;
  return <Template cvData={cvData} color={primaryColor} font={fontFamily} />;
};

export default CVTemplateRenderer;