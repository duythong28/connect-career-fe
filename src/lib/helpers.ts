export const maskEmail = (email: string, showFull: boolean = true): string => {
  if (showFull) return email;
  const [name, domain] = email.split("@");
  return `${name.substring(0, 2)}****@${domain}`;
};

export const maskPhone = (phone: string, showFull: boolean = true): string => {
  if (showFull) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{3})/, "$1****$2");
};

export const calculateMatchingScore = (
  candidateSkills: string[],
  jobKeywords: string[],
  experienceYears: number = 0
): number => {
  const baseScore = 50;
  const skillMatches = candidateSkills.filter((skill) =>
    jobKeywords.some(
      (keyword) =>
        keyword.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(keyword.toLowerCase())
    )
  ).length;
  const skillScore = skillMatches * 8;
  const experienceScore = Math.min(experienceYears * 3, 20);
  return Math.min(baseScore + skillScore + experienceScore, 100);
};
