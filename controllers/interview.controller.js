//const asyncHandler = require('../middleware/asyncHandler.middleware');
// const InvoiceCargo = require('../models/invoice.cargo.model');


let questions = [
    {
      id: 1,
      title: "User-Level Linux",
      description: "This quiz checks your understanding about introduction to Linux",
      questions: [ 
        {question: "The kill command is only meant to terminate processes.", answer: ["true", "false"]},
        {question: "We want to use the whatis tool to figure out what the command named foobar does. We know it exists both in sections 3 & 9 of the manual so we'd like to specify for whatis to only look into section 9. The textbook mentions that man -f or whatis can not be that specific but the whatis tool is actually able to let you specify a section number. Which of the following syntax will allow you to do so? Hint - Testing in a shell window might hel", answer: ["whatis 9 foobar", "whatis -k 9 foobar", "whatis -s 9 foobar"]},
        {question: "Which shell command would you issue to display the kernel version of the operating system you are running?", answer: ["linux -a", "uname -a", "host -a"]}
        ]
    },
    {
      id: 2,
      title: "Fundation of Cybersecurity",
      description: "This quiz checks your understanding about cybersecurity.",
      questions: [ 
        {question: "Firewalls that provide 'air gap' provide impenetrable security", answer: ["true", "false"]},
        {question: "Many companies employ 'red teams' to often try to trick their own employees to open suspicious email", answer: ["true", "false", "maybe"]},
        {question: "The endpoint can only view the last proxy with which it is directly communicating and not any of the intermediary proxies or the original location", answer: ["true", "false"]}
        ]
    },
    {
        id: 3,
        title: "DevOps",
        description: "This quiz checks your understanding about DevOps",
        questions: [ 
          {question: "Which is not a characteristic of the cloud defined by NIST (National Institute of Standards and Technology)?", answer: ["Rapid elasticity", "Broad network access", "Self diagnosis"]},
          {question: "The CRM of Salesforce.com is a good example of", answer: ["SaaS", "PaaS", "IaaS"]},
          {question: "When user issues a command to create a VM, this user must also decide on which physical machine to create the VM instance", answer: ["True", "False"]}
          ]
      }
  ];



let answers = [
    { id: 1, value: ["false", "whatis -s 9 foobar","uname -a"] },
    { id: 2, value: ["false", "true", "true"] },
    { id: 3, value: ["Self diagnosis", "SaaS", "False"] },
]

exports.getQuetions = (req, res, next) => {
    return res.status(200).json(questions);
};

exports.getById = (req, res, next) => {
   let test = questions.find(v => v.id == req.params.id);
    return res.status(200).json({response: test});
};

exports.reviewQuestions = (req, res, next) => {
    
    console.log("in review", req.body);
    let userAnswers = req.body;
    console.log(userAnswers.answers);
    let correctAnsws = answers.find(answ => answ.id === userAnswers.id);
    let totalPoint = correctAnsws.value.length;

    for(let i = 0; i < correctAnsws.value.length; i++){
        if(correctAnsws.value[i].toString() !== userAnswers.answers[i].toString()) {
            totalPoint--;
        }
    }

    return res.status(200).json({result: totalPoint});

}





