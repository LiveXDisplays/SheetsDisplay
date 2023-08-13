/*

https://stateful.com/blog/google-sheets-api-tutorial

*/
const axios = require('axios');
const { google } = require("googleapis");

const SheetID = "[SHEETID]";
const keyFile = "[KEYFILE].json";

async function authSheets() {
  //Function for authentication object
  const auth = new google.auth.GoogleAuth({
    keyFile: keyFile,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  //Create client instance for auth
  const authClient = await auth.getClient();

  //Instance of the Sheets API
  const sheets = google.sheets({ version: "v4", auth: authClient });

  return {
    auth,
    authClient,
    sheets,
  };
}



async function main() 
{
  const { sheets } = await authSheets();

  // Read rows from spreadsheet
  const getRows = await sheets.spreadsheets.values.get({
    spreadsheetId: SheetID,
    range: "Sheet1",
  });
  
  let ret;

  console.log(getRows.data);
  let grid=getRows.data.values;
  let value=' '+grid[0][0]+','+grid[0][1];
  value+='\n'+grid[1][0]+','+grid[1][1];
  value=encodeURIComponent(value);
  // Simulator - Change IP For the Real board                                    WW--FFEESPSTAC  
  ret=await axios.get(`http://127.0.0.1:8080/ws?K=KEY1&A=SEROUT&T=OK&O=2&D=%5B01T04000101000001${value}XX%5D`);
  console.log(ret.data);
  //                                                                             WW--FFEESPSTAC  
  //ret=await axios.get("http://localhost:8080/ws?K=KEY1&A=SEROUT&T=OK&O=2&D=%5B01T05000101000001Test1XX%5D");
  //console.log(ret.data);

}


main();