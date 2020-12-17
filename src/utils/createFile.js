module.exports = function(dirName, templateFileName) {
  const fs = require("fs");
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const templateMap = {
    "{{query}}": "Query",
    "{{create}}": "Create",
    "{{del}}": "Del",
    "{{update}}": "Update"
  };
  const currentDirPath = dirName + "/";
  let filePath = "";
  let moduleName = "";

  setFilePathAndModuleName();

  function setFilePathAndModuleName() {
    new Promise(resolve => {
      rl.question("请输入生成文件路径?", path => {
        filePath = path;
        console.log(`文件路径：${path}`);
        return resolve();
      });
    }).then(() => {
      rl.question("请输入模块名字?", async name => {
        console.log(`模块名字：${name}`);
        moduleName = name;
        console.log("创建中...");
        setDefaultModule();
        await createFile();
        rl.close();
      });
    });
  }

  function setDefaultModule() {
    if (filePath) {
      moduleName = filePath
        .split("/")
        .pop()
        .split(".")[0];
      return;
    }
  }

  async function checkFileDir() {
    if (filePath) {
      const filePaths = filePath.split("/");
      const length = filePaths.length - 1;
      for (let i = 0; i < length; i++) {
        const elementBeforePath = getElementInBefore(filePaths, i);
        const item = filePaths[i];
        try {
          await fs.readdirSync(currentDirPath + elementBeforePath + item);
        } catch (error) {
          await fs.mkdirSync(currentDirPath + elementBeforePath + item);
        }
      }
      return true;
    } else {
      return false;
    }
  }

  async function createFile() {
    const flag = await checkFileDir();
    if (flag) {
      try {
        const paths = filePath.split("/");
        if (paths.length > 1) {
          const data = await fs.readFileSync(currentDirPath + templateFileName);
          let tempData = data.toString();
          console.log(filePath);
          await fs.writeFileSync(
            currentDirPath + filePath,
            replaceTemplate(tempData)
          );
          console.info("创建成功");
        } else {
          try {
            await fs.readdirSync(currentDirPath + filePath);
          } catch (error) {
            await fs.mkdirSync(currentDirPath + filePath);
          }
          console.info("创建成功");
        }
        return true;
      } catch (error) {
        console.log("创建失败", error);
        return false;
      }
    }
  }

  function replaceTemplate(tempData) {
    for (let key in templateMap) {
      const value = templateMap[key];
      tempData = setTempData(tempData, key, value);
    }
    tempData = tempData.replace(/`/g, "");
    return tempData;
  }

  function setTempData(tempData, key, value) {
    let flag = true;
    while (flag) {
      tempData = tempData.replace(key, moduleName + value);
      flag = tempData.includes(key);
    }
    return tempData;
  }

  function getElementInBefore(data, index) {
    let result = "";
    for (let i = 0; i < index; i++) {
      result += data[i] + "/";
    }
    return result;
  }
};
