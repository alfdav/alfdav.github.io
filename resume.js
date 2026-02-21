window.resumeData =
{
  "selectedTemplate": 2,
  "headings": {
    "education": "Education",
    "awards": "Certifications",
    "skills": "Technical Skills",
    "work": "Work Experience",
    "projects": "Contributions"
  },
  "basics": {
    "name": "David Diaz",
    "location": {
      "address": "The Colony, TX"
    },
    "website": "https://github.com/alfdav"
  },
  "education": [
    {
      "institution": "Universidad Tecnologica de Mexico",
      "location": "Mexico City, Mexico",
      "studyType": "Bachelors",
      "area": "Business",
      "gpa": "3.5",
      "startDate": "Sep 2010",
      "endDate": "Sep 2015"
    },
    {
      "institution": "Python tooling, AI-curious security automation, HTB, SANS/NIST-flavored thinking",
      "location": "web app & API exploitation (OSWE/OSCP), red teaming, cloud security (AWS/Azure/Docker)",
      "endDate": "",
      "studyType": "I made this resume in JSON. Let's open a TTY",
      "area": "Python: `python -c 'import pty; pty.spawn(\"/bin/bash\")'`"
    }
  ],
  "work": [
    {
      "highlights": [
        "Executed a solo 6-day enterprise web application assessment, escalating from grey-box to white-box through chained SQL injection into staging infrastructure, identifying 45+ injection surfaces across 6 modules.",
        "Exploited a minor XSS vulnerability into 14 critical security flaws (XSS, SSRF, IDOR), leading to security patch issuance across public-facing applications.",
        "Discovered and exploited a critical JWT algorithm confusion (alg:none) vulnerability on an international property, achieving unauthorized admin access and demonstrating GDPR-relevant PII exposure.",
        "Achieved Remote Code Execution on two international properties by escalating low-severity VDP findings into full RCE chains with documented proof-of-concept.",
        "Developed and deployed a suite of Python security tools (FlightCheck, HeapCred, PHPHunter, PubCheck, Zeugpin, ANDNS2, curlthis, ANGROUPER) adopted by the security team for operational use.",
        "Authored a net-new Swagger UI SSRF detection signature for AssetNote, enabling organization-wide continuous exposure monitoring.",
        "Exploited a time-based blind SQL injection using a custom RLIKE-based WAF bypass technique, extracting database contents where automated tools (sqlmap) were blocked.",
        "Architected a multi-agent cognitive security pipeline integrating Burp Suite, Nuclei, and reconnaissance tools via MCP servers, with epistemic safety constraints ensuring human decision authority."
      ],
      "company": "The Walt Disney Company",
      "position": "Resident Hacker & Red Team",
      "location": "Burbank, CA",
      "startDate": "April 2024",
      "endDate": "Present"
    },
    {
      "highlights": [
        "Led application penetration tests across public and private networks, identifying and validating vulnerability chains in network, cloud, and infrastructure environments.",
        "Supported Red Team adversary simulation missions, contributing to initial access and lateral movement phases during enterprise engagements.",
        "Co-developed CLAWS (formerly LambdaLooter), a static code review tool now published on State Farm's public GitHub repository.",
        "Presented risk advisories and attack path analysis to executive leadership and technical stakeholders, driving measurable security improvements.",
        "Enhanced penetration testing methodology and assessment materials adopted across the security team."
      ],
      "company": "State Farm",
      "position": "Penetration Tester",
      "location": "Richardson, TX",
      "startDate": "March 2021",
      "endDate": "April 2024"
    },
    {
      "highlights": [
        "Led application penetration testing on company products, identifying device vulnerabilities and implementing corrective security measures.",
        "Performed wireless and network assessment of the US corporate headquarters using Nmap, Aircrack-ng, and Airgeddon.",
        "Conducted security testing on AndroidOS-based products, hardening production firmware against identified attack vectors.",
        "Designed and implemented a GHOST imaging solution that increased deployment productivity by 514% and reduced imaging time by 302% — infrastructure now generates $4M annually for the company.",
        "Managed a $500,000 IT security budget, achieving 15% cost savings through vendor contract negotiation and resource optimization."
      ],
      "position": "Security Support Engineer",
      "location": "Plano, TX",
      "company": "Newline Interactive",
      "startDate": "April 2018",
      "endDate": "February 2021"
    }
  ],
  "skills": [
    {
      "name": "Technical Arsenal",
      "keywords": [
        "• Offense: Web/API exploitation (OSWE, OSCP, eWPT), red teaming, perimeter assessment."
      ]
    },
    {
      "keywords": [
        "• Cloud & Infra: AWS (Pacu, Prowler, CloudFox), Azure, Docker, attack surface mapping."
      ]
    },
    {
      "keywords": [
        "• Toolsmithing: Python (HeapCred, PHPHunter, Zeugpin, ANDNS2, curlthis, ANGROUPER), Bash."
      ]
    },
    {
      "keywords": [
        "• Detection: Splunk (CCU), Wireshark, Nmap, Burp Suite, OWASP ZAP, SQLMap, Metasploit."
      ]
    },
    {
      "keywords": [
        "• Foundations: HTTP/TCP/IP, DNS, auth flows, OWASP, PTES, NIST-flavored threat modeling."
      ]
    },
    {
      "keywords": [
        "• AI: 5-agent cognitive security pipeline, MCP tool orchestration, battle-tested in production."
      ]
    }
  ],
  "projects": [
    {
      "name": "TempFox - AWS Security Assessment Tool - Developer",
      "description": "AWS credential management and security assessment tool",
      "url": "https://github.com/alfdav/TempFox",
      "keywords": [
        "AWS CLI",
        "Python"
      ]
    },
    {
      "name": "HackTheBox Dallas Meetup Ambassador",
      "description": "Founded and lead the Dallas HTB community, organizing hands-on offensive security training and CTF events, fostering local security talent development",
      "url": "https://meetu.ps/c/4wy4d/KHYFY/a",
      "keywords": [
        "Community Leadership",
        "Security Training",
        "CTF"
      ]
    },
    {
      "keywords": [
        "Python"
      ],
      "name": "LambdaLooter (now CLAWS) - Collaborator",
      "url": "https://github.com/StateFarmIns/CLAWS",
      "description": "This application was built to help reduce the amount of time it takes to review static code."
    },
    {
      "keywords": [
        "Python"
      ],
      "name": "FlightCheck - Developer",
      "description": "Production-grade vulnerability scanner for React Server Components RCE (CVE-2025-55182), featuring three-stage verification, WAF evasion, and false-positive-resistant canary validation",
      "url": "https://github.com/alfdav/flightcheck"
    },
    {
      "keywords": [
        "Python"
      ],
      "name": "Disney VRT Security Toolkit - Developer",
      "description": "Suite of 7 Python security tools deployed to team infrastructure: PubCheck (API key validation), HeapCred (heap dump credential scanner), PHPHunter (phpinfo exposure scanner), Zeugpin (Werkzeug exploit tool), ANDNS2 (domain verification), curlthis (request transformer), ANGROUPER (scan data processor)",
      "url": "Disney GitLab"
    }
  ],
  "awards": [
    {
      "title": "OSWE",
      "awarder": "Offensive Security",
      "date": "Nov 2023",
      "summary": "Offensive Security Web Expert - Advanced proficiency in web application security, business logic flaw identification, and hands-on exploitation",
      "verify_url": "https://credentials.offsec.com/1dc99c28-b380-49e8-8a46-29eebd9f5324#acc.fjigS8Es"
    },
    {
      "awarder": "eLearnSecurity",
      "title": "eWPT",
      "summary": "eLearnSecurity Web Application Penetration Tester - Specialized expertise in web application security testing and exploitation techniques",
      "date": "May 2021"
    },
    {
      "title": "OSCP",
      "date": "Nov 2020",
      "awarder": "Offensive Security",
      "summary": "Offensive Security Certified Professional - Demonstrated practical penetration testing skills and methodology"
    },
    {
      "title": "Splunk-CCU",
      "date": "Jun 2019",
      "awarder": "Splunk",
      "summary": "Splunk Certified Core User"
    },
    {
      "date": "May 2019",
      "awarder": "Amazon Web Services (AWS)",
      "summary": "Amazon Web Services Solutions Architect Associate",
      "title": "AWS-SAA"
    },
    {
      "title": "CompTIA Security+",
      "date": "Mar 2019",
      "awarder": "CompTIA"
    }
  ],
  "sections": [
    "templates",
    "profile",
    "skills",
    "awards",
    "work",
    "projects",
    "education"
  ]
};
