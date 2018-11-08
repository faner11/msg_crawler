var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/runoob";


function getSyncTime() {
  return new Promise((resolve, reject) => {
    try {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        let dbo = db.db("runoob");
        resolve( dbo )
      });
    } catch ( err ) {
      reject( err )
    }
  })
}

async function getSyncData() {
  let time = await getSyncTime();
  time .collection("school").drop();
  let result = await time.collection("site").find().toArray();
  console.log(result.length);
  let resultArr = unique(result);
  let arr = [];
  for (let item of resultArr) {
    if (item.content && item.content.length >= 4) {
      let school_data = cs_school_name(item.content);
      if (school_data) {
        let obj = {
          content: item.content,
          school_name: school_data.school_name,
          remarks: school_data.remarks,
          date_time: item.date_time,
          fakeid: item.fakeid,
          id: item.id,
          nick_name: item.nick_name
        };
        arr.push(obj);
      }
    };
  }
  time.collection("school").insertMany(arr, function (err, res) {
    if (err) throw err;
    console.log("文档插入成功", arr.length);
  });
}

getSyncData();


// 数组去重复
function unique(arr) {
  let result = [], hash = {};
  for (let i = 0, len = arr.length; i < len; i++) {
    if (!hash[arr[i].fakeid]) {
      result.push(arr[i]);
      hash[arr[i].fakeid] = true;
    }
  }
  return result;
  //http://www.cnblogs.com/sosoft/
}

// 返回将学校名称
function cs_school_name(str) {
  str = str.replace(/\s+/g, "");
  let school_index;
  let school_obj = {
    xueyuan: str.indexOf('学院'),
    xuexiao: str.indexOf('学校'),
    daxue: str.indexOf('大学')
  };

  for (let key in school_obj) {
    if (school_obj[key] > 0) {
      school_index = school_obj[key]
    }
  }
  let obj = {
    school_name: str.substr(0, school_index + 2),
    remarks: str.substr(school_index + 2, str.length),
  }
  if (obj.school_name) {
    return obj;
  } else {
    return false;
  }

}


