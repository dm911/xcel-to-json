var express = require('express');
var router = express.Router();
var u = require('underscore');
// var moment = require('moment');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var fs = require("fs");
var formidable = require("formidable");
var XLSX = require("xlsx");


router.post("/UploadXcel", jsonParser, async function (req, res) {
    try {
      //Set Parameter for User Permission
      req.query["tablename"] = req.headers["x-requested-with"];
  
      //set Parameter
      var obj = {};
      obj.headers = req.headers;
      obj.query = req.query;
      var userid;
      var form = new formidable.IncomingForm();
      form.uploadDir = __dirname + "/../mediaupload/";
      var FileName = [];
      var oldFileName = null;
      var newFileName = null;
  
      //file upload path
      form.parse(req, function (err, fields, files) {
        objData = fields;
      });
  
      form.on("fileBegin", function (name, file) {
        oldFileName = file.name;
        
        file.path = form.uploadDir + "/" + oldFileName;
        FileName.push(file.path);
      });
  
      form.on("end", async function () {
        if (FileName.length > 0) {
          var workbook = XLSX.readFile(FileName[0], {
            type: "binary",
          });
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          if (worksheet != null && worksheet != undefined && worksheet != "") {
            var lstExcel = [];
            lstExcel = XLSX.utils.sheet_to_json(worksheet);
            var lstData = [];
            var headers = [];
            var range = XLSX.utils.decode_range(worksheet["!ref"]);
            var C,
              R = range.s.r;
              
            
            let blockval='BLOCK-';
            let count=1;
            let lstFinalData=[];
            function initBlock(){
              return objBlock={
                name:"",
                data:[]
              }
            }
            
            // let currentBlock=blockval+count;
            // res.json(lstExcel)
            // console.log(";current;",currentBlock)

            let blockData=initBlock();
            u.filter(lstExcel,(objExcel)=>{                
              
              if(objExcel["A"]==='A' ){
                lstFinalData.push(blockData);
                count++;
                blockData=initBlock();
              }else if(objExcel===lstExcel[lstExcel.length-1]){
                lstFinalData.push(blockData);
              }

              // else if(objExcel["BLOCK-1"][blockval+count]){
                
              // }
              let currentBlock=blockval+count;
              blockData.name=currentBlock;
              if(currentBlock!=objExcel["BLOCK-1"]){
                
                let val=objExcel["BLOCK-1"]
                let obj={
                    'A':objExcel["A"],
                    'B':objExcel["B"],
                    'C':objExcel["C"],
                    'D':objExcel["D"],
                    'E':objExcel["E"],
                    'F':objExcel["F"],
                    'G':objExcel["G"],
                    'H':objExcel["H"],
                    'I':objExcel["I"],
                    'J':objExcel["J"]
                };
                let o={
                  [val]:obj
                }
                blockData.data.push(o)
                // console.log(":::blockDAT",blockData)
              }
            })
            res.json(lstFinalData)
            fs.writeFile('./mediaupload/json/myjsonfile.json', JSON.stringify(lstFinalData), (err) => {
              if (err) {
                console.error(err)
                return
              }
              //file written successfully
            })
            
          } else {
            return res.json({
              success: false,
              message: "Error in Import , Excel File is Protected..",
            });
          }
        } else {
          return res.json({
            success: false,
            message: "Error in Import , Excel File is Protected..",
          });
        }
      });
    } catch (err) {
      return res.json({
        success: false,
        message: err.message,
      });
    }
  });
module.exports = router