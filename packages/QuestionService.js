const { prompt, select, confirm, scale } = require('enquirer');

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

  funcs.Scale = async () => { // Specifically for memory selection.
    const response = await scale({
      name : name,
      message : message,

      scale : [
        { name: '1 GB'},
        { name: '2 GB'},
        { name: '3 GB'},
        { name: '4 GB'},
        { name: '5 GB'},
        { name: '6 GB'}
      ],

      choices : choices
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
  } else if (type == "scale") {
    const answer = await enquirer.Scale();
    return answer;
  }
}

module.exports = {
    Question
}