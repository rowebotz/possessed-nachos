export const PREAMBLE_TEXT = "We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America.";

export const ARTICLE_SUMMARIES = [
  { title: 'Article I — Legislative Branch', summary: 'Creates Congress, a bicameral legislature (House and Senate), and outlines lawmaking powers.' },
  { title: 'Article II — Executive Branch', summary: 'Creates the presidency, describing powers and duties of the executive.' },
  { title: 'Article III — Judicial Branch', summary: 'Establishes the Supreme Court and the federal judiciary.' },
  { title: 'Article IV — States', summary: 'Relations among states; Full Faith and Credit; admission of new states.' },
  { title: 'Article V — Amendments', summary: 'Process to propose and ratify constitutional amendments.' },
  { title: 'Article VI — Supremacy', summary: 'The Constitution, federal laws, and treaties are the supreme law; no religious tests.' },
  { title: 'Article VII — Ratification', summary: 'Procedure for ratifying the Constitution.' },
  { title: 'Bill of Rights — Amendments 1–10', summary: 'Key civil liberties: speech, religion, due process, and more.' },
  { title: 'Civil War Amendments — 13, 14, 15', summary: 'End slavery, define citizenship and equal protection, protect voting rights.' },
  { title: 'Later Amendments', summary: 'Further refine elections, succession, term limits, voting rights, and governance.' }
];

export const CONCEPTS = [
  { id: 1, title: 'Popular Sovereignty', explain: 'Government power comes from the people.' },
  { id: 2, title: 'Limited Government', explain: 'Government is restricted by the Constitution and the rule of law.' },
  { id: 3, title: 'Separation of Powers', explain: 'Power is divided among legislative, executive, and judicial branches.' },
  { id: 4, title: 'Checks and Balances', explain: 'Each branch can limit the others to prevent abuse of power.' },
  { id: 5, title: 'Federalism', explain: 'Power is shared between national and state governments.' },
  { id: 6, title: 'Judicial Review', explain: 'Courts can interpret the Constitution and strike down unconstitutional laws.' },
  { id: 7, title: 'Enumerated Powers', explain: 'Powers explicitly granted to the federal government in Article I, Section 8.' },
  { id: 8, title: 'Necessary and Proper Clause', explain: 'Congress can make laws needed to carry out its powers.' },
  { id: 9, title: 'Commerce Clause', explain: 'Congress regulates trade among states, with foreign nations, and tribes.' },
  { id: 10, title: 'Supremacy Clause', explain: 'The Constitution and federal law are the supreme law of the land.' },
  { id: 11, title: 'Full Faith and Credit', explain: 'States must respect other states’ public acts, records, and judicial proceedings.' },
  { id: 12, title: 'Privileges and Immunities', explain: 'States cannot discriminate against citizens of other states.' },
  { id: 13, title: 'First Amendment', explain: 'Protects speech, religion, press, assembly, and petition.' },
  { id: 14, title: 'Second Amendment', explain: 'Protects the right to keep and bear arms.' },
  { id: 15, title: 'Fourth Amendment', explain: 'Protects against unreasonable searches and seizures.' },
  { id: 16, title: 'Fifth Amendment', explain: 'Due process, no double jeopardy, no self-incrimination, and just compensation.' },
  { id: 17, title: 'Sixth Amendment', explain: 'Right to a speedy, public trial by jury and counsel.' },
  { id: 18, title: 'Eighth Amendment', explain: 'No cruel and unusual punishments; no excessive bail or fines.' },
  { id: 19, title: 'Tenth Amendment', explain: 'Powers not given to the federal government are reserved to the states or the people.' },
  { id: 20, title: 'Thirteenth Amendment', explain: 'Abolishes slavery and involuntary servitude, except as punishment for crime.' },
  { id: 21, title: 'Fourteenth Amendment', explain: 'Citizenship, due process, and equal protection under the laws.' },
  { id: 22, title: 'Fifteenth Amendment', explain: 'Prohibits denying the right to vote on the basis of race, color, or previous condition of servitude.' },
  { id: 23, title: 'Nineteenth Amendment', explain: 'Extends voting rights to women.' },
  { id: 24, title: 'Twenty-Fourth Amendment', explain: 'Abolishes poll taxes in federal elections.' },
  { id: 25, title: 'Twenty-Sixth Amendment', explain: 'Lowers the voting age to 18.' },
  { id: 26, title: 'Rule of Law', explain: 'Everyone, including government officials, is subject to the law.' },
  { id: 27, title: 'Bicameralism', explain: 'Congress has two chambers: the House and the Senate.' },
  { id: 28, title: 'Electoral College', explain: 'Process for electing the President through state-chosen electors.' },
  { id: 29, title: 'Impeachment', explain: 'Process to charge and try federal officials for misconduct.' },
  { id: 30, title: 'Treaty Power', explain: 'President negotiates treaties; Senate gives advice and consent.' },
  { id: 31, title: 'Appointments Clause', explain: 'President appoints officers; Senate confirms many of them.' },
  { id: 32, title: 'Habeas Corpus', explain: 'Protects against unlawful detention; can be suspended in limited cases.' },
  { id: 33, title: 'Ex Post Facto', explain: 'No laws may retroactively criminalize behavior.' },
  { id: 34, title: 'Bill of Attainder', explain: 'Legislatures cannot punish individuals without trial.' },
  { id: 35, title: 'Exclusionary Rule', explain: 'Illegally obtained evidence is often inadmissible in court.' },
  { id: 36, title: 'Incorporation', explain: 'Most Bill of Rights protections apply to states via the Fourteenth Amendment.' },
  { id: 37, title: 'Freedom of Expression', explain: 'Speech protections include symbolic speech, with limits for incitement and true threats.' },
  { id: 38, title: 'Free Exercise and Establishment', explain: 'Government cannot establish religion or unduly burden free exercise.' },
  { id: 39, title: 'Due Process', explain: 'Fair procedures and, in some contexts, substantive protections.' },
  { id: 40, title: 'Equal Protection', explain: 'Government must treat similarly situated people similarly, with appropriate scrutiny.' }
];

// Simple quiz bank; each entry has: prompt, choices, correctIndex
export const QUIZ_BANK = [
  { prompt: 'Which Article establishes the legislative branch?', choices: ['Article I', 'Article II', 'Article III', 'Article IV'], correctIndex: 0 },
  { prompt: 'What does the Supremacy Clause do?', choices: ['Creates the Supreme Court', 'Makes federal law supreme over state law', 'Protects freedom of speech', 'Allows amendments'], correctIndex: 1 },
  { prompt: 'Which amendment guarantees due process and protects against self-incrimination?', choices: ['First', 'Fourth', 'Fifth', 'Sixth'], correctIndex: 2 },
  { prompt: 'Which amendment abolished slavery?', choices: ['Tenth', 'Thirteenth', 'Fourteenth', 'Fifteenth'], correctIndex: 1 },
  { prompt: 'The Necessary and Proper Clause is also called the…', choices: ['Supremacy Clause', 'Elastic Clause', 'Commerce Clause', 'Privileges and Immunities'], correctIndex: 1 },
  { prompt: 'Which Article establishes the executive branch?', choices: ['Article I', 'Article II', 'Article III', 'Article VI'], correctIndex: 1 },
  { prompt: 'The Bill of Rights refers to…', choices: ['Articles I–V', 'The first 10 amendments', 'Amendments 11–27', 'The preamble'], correctIndex: 1 },
  { prompt: 'Equal Protection is found in which amendment?', choices: ['First', 'Fourth', 'Fourteenth', 'Tenth'], correctIndex: 2 },
  { prompt: 'Full Faith and Credit refers to…', choices: ['State recognition of other states’ acts', 'Federalism', 'Treaty power', 'Judicial review'], correctIndex: 0 },
  { prompt: 'Which branch interprets laws?', choices: ['Legislative', 'Executive', 'Judicial', 'Military'], correctIndex: 2 }
];