export interface CareerPath {
    id: number;
    title: string;
    description: string;
    icon: string;
    career_insights: string;
    job_market_trends: string;
    job_profiles: string[];
    top_companies: string[];
    skills_required: string[];
    average_salary: string;
    growth_potential: string;
    relevance_score?: number;
  }
  
  export interface JobRecommendation {
    title: string;
    company: string;
    location: string;
    salary: string;
    link: string;
    source: string;
  }
  
  export interface StudentProfile {
    id: string;
    full_name: string;
    engineering_branch: string;
    skills: string[];
    hobbies: string[];
    dream_companies: string[];
  }
  
  