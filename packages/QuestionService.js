const { prompt, select, confirm } = require('enquirer');

async function enquirerFuncs(type, name, message, choices=[]) {
  let funcs = {}

  funcs.Prompt = async () => {
    const response = await prompt({
      type : type,
      name : name,
      message : message
    })
    
    return response;
  }

  funcs.Select = async () => {
    const response = await select({
      name : name,
      message : message,
      choices : choices
    })

    return response;
  }

  funcs.Confirm = async () => {
    const response = await confirm({
      name : name,
      message : message,
      default : true
    })

    return response;
  }

  return funcs;
}

async function Question(type, name, message, choices = []) {
  const enquirer = await enquirerFuncs(type, name, message, choices);

  if (type == "input") {
    const answer = await enquirer.Prompt();
    return answer[name];
  } else if (type == "select") {
    const answer = await enquirer.Select();
    return answer;
  } else if (type == "confirm") {
    const answer = await enquirer.Confirm();
    return answer;
  }
}

module.exports = {
    Question
}