const textTaskCreate = async (lessonData) => {
  const { content, title } = lessonData;
  lessonData.TextContent = {
    create: { content, title},
  };
};

const testTaskCreate = async (lessonData) => {
  const { title, question, options, correctAnswer } = lessonData;
  lessonData.TestContent = {
    create: { title, question, options, correctAnswer },
  };
};

const videoTaskCreate = async (lessonData) => {
  const { title, url } = lessonData;
  lessonData.VideoContent = {
    create: { title, url },
  };
};

module.exports = { textTaskCreate, testTaskCreate, videoTaskCreate };
