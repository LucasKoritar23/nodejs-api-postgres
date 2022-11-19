const axios = require("axios");
const uri = '';
const uriSlack = '';

const reqGetMessages = async (date) => {
  let config = {
    method: "get",
    url: `${uri}/events/date/${date}`,
    headers: {},
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (e) {
    throw e;
  }
};

const reqPostMessages = async (message) => {
  let payload = JSON.stringify({
    text: message,
  });

  let config = {
    method: "post",
    url: uriSlack,
    headers: {
      "Content-Type": "application/json",
    },
    data: payload,
  };

  try {
    const response = await axios(config);
    return response;
  } catch (e) {
    throw e;
  }
};

const reqPostHistory = async (id) => {
  let payload = JSON.stringify({});
  let config = {
    method: "post",
    url: `${uri}/events/history/` + id,
    headers: {
      "Content-Type": "application/json",
    },
    data: payload,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (e) {
    throw e;
  }
};

async function postHistory(id) {
  try {
    await reqPostHistory(id);
  } catch (err) {
    console.log(err);
    return [];
  }
}

async function getMessages(date) {
  try {
    const messages = await reqGetMessages(date);
    return messages;
  } catch (err) {
    console.log(err);
    return [];
  }
}

async function postMessages(message) {
  try {
    const messages = await reqPostMessages(message);
    return messages;
  } catch (err) {
    console.log(err);
    return [];
  }
}

(async function () {
  const strftime = require("strftime");
  const currentDate = strftime("%Y-%m-%d");
  const messages = await getMessages(currentDate);
  messages.forEach(async function (value) {
    let message = value.message_text;
    let id = value.id;
    console.log(id);
    console.log(message);
    const messages = await postMessages(message);
    if (messages.status == 200) {
      await postHistory(id);
    }
  });
})();
