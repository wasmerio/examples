interface Education {
    title: string;
    startDate: string;
    endDate?: string;
    school: string;
    location: string;
    description: string;
    currentUni: boolean;
}

const  education: Education[] = [
    {
        title: "General English",
        startDate: "2024-09-01",
        endDate: "",
        school: "University Name",
        location: "United States",
        description: "Developed and maintained web applications using React, NodeJs, and MongoDB.",
        currentUni: true,
    },
    {
        title: "Bachelor of Science in Computer Science",
        startDate: "2014-09-01",
        endDate: "2018-06-30",
        school: "University Name",
        location: "United States",
        description: "Developed and maintained web applications using React, NodeJs, and MongoDB.",
        currentUni: false,
    },
    {
        title: "Bachelor of Science in Computer Science",
        startDate: "2012-09-01",
        endDate: "2013-06-30",
        school: "University Name",
        location: "United States",
        description: "Developed and maintained web applications using React, NodeJs, and MongoDB.",
        currentUni: false,
    },
];

export default education;