		// TODO: Add SDKs for Firebase products that you want to use
		// https://firebase.google.com/docs/web/setup#available-libraries
	  
		// Your web app's Firebase configuration
		// For Firebase JS SDK v7.20.0 and later, measurementId is optional
		const firebaseConfig = {
            apiKey: "AIzaSyBbc0jat_qItkWBR2j7AKoGk_Pnac07iew",
            authDomain: "csvdata-27295.firebaseapp.com",
            projectId: "csvdata-27295",
            storageBucket: "csvdata-27295.appspot.com",
            messagingSenderId: "287902525442",
            appId: "1:287902525442:web:b274f07443732c338e1f1b",
            measurementId: "G-5E8DXDV85C"
          };
        
          // Initialize Firebase
          // Initialize Firebase
          firebase.initializeApp(firebaseConfig);
              
          // Initialize Cloud Firestore and get a reference to the service
          const db = firebase.firestore();
          // db.settings({timestampsInSnapshots:true});
  
  
  
          let csvData;
          let i = 0;
          let h1='';
          let h2='';
          const row1=document.getElementById("row1");
          const row2=document.getElementById("row2");
          const row1h1=document.getElementById("row1h1");
          const row2h2=document.getElementById("row2h2");
          let prev = document.getElementById('prev');
          let next = document.getElementById('next');
          let save = document.getElementById('save');
          let download = document.getElementById('download');
          let load = document.getElementById('load');
          let saveToDb = document.getElementById('saveToDb');
          let dbData = document.getElementById('dbData');
  
  
          let btn_upload = document.getElementById('btn-upload-csv').addEventListener('click', ()=> {
              Papa.parse(document.getElementById('upload-csv').files[0], {
                  download: true,
                  header: true,
                  complete: function(results) {
                      // console.log(results);
                      readData(results.data);
                  }
              })
          });
  
          //read csv data
          const readData=data=>{
                      csvData=data;
                      console.log("From readData()",csvData)
                      // console.log("Object.entries(results.data[i])",Object.entries(results.data[i])[0])
                      h1=Object.keys(csvData[i])[0].toString();
                      h2=Object.keys(csvData[i])[1].toString();
                      row1h1.innerHTML=h1;
                      row2h2.innerHTML=h2;
                      row1.value=csvData[i][h1].toString();
                      row2.value=csvData[i][h2].toString();
          }
  
          //previou button
          prev.addEventListener("click",()=>{
              if(i>1){
                  i--;
                  row1.value=csvData[i][h1].toString();
                  row2.value=csvData[i][h2].toString();
              }
          });
          
          //Next button
          next.addEventListener("click",()=>{
              if(i>-1 && i<csvData.length-1){
                  // console.log(csvData.length)
                  i++;
                  row1.value=csvData[i][h1].toString();
                  row2.value=csvData[i][h2].toString();
              }
          });
  
          //Save button
          save.addEventListener("click",()=>{
              if(i>-1 && i<csvData.length-1){
                  csvData[i][h1]=row1.value;
                  csvData[i][h2]=row2.value;
                  console.log("Changes saved",csvData);
              }
          });
  
          //Download button
          download.addEventListener("click",()=>{
              if(csvData.length!=0){	
                  const csv=Papa.unparse(csvData);
                  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                      if (navigator.msSaveBlob) { // IE 10+
                              navigator.msSaveBlob(blob, "untitled.csv");
                  } else {
                      var link = document.createElement("a");
                          if (link.download !== undefined) { // feature detection
                          // Browsers that support HTML5 download attribute
                      var url = URL.createObjectURL(blob);
                         link.setAttribute("href", url);
                        link.setAttribute("download", "untitled.csv");
                         link.style.visibility = 'hidden';
                      document.body.appendChild(link);
                      link.click();
                          document.body.removeChild(link);
                          }
                      }
              }
          });
  
          //Save to Database button
          saveToDb.addEventListener("click",()=>{
              let filename='file'+Date.now();
              if(csvData.length != 0){
                  db.collection("records").doc(filename).set({csvData}).then(()=>console.log("Data save to database successful"))
                  .catch(err=>console.log(err));;
                  
              }
          });
  
          //Load from Database
          load.addEventListener("click",()=>{
              dbData.innerHTML='';
              db.collection("records").get().then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                  
                  let html=``;
                  html+=`		<div class="col-sm-6">
                              <div class="card">
                                  <div class="card-body">
                                  <h5 class="card-title">${doc.id}</h5>
                                  <a href="#" class="btn btn-primary" onclick="dbFile('${doc.id}')">Read CSV</a>
                                  </div>
                              </div>
                              </div>
                  `;
                  dbData.innerHTML+=html;
                  
              });
              
            }).then(()=>console.log("Data loaded from db"))
                  .catch(err=>console.log(err));;
          });
  
          const dbFile=id=>{
              csvData='';
              console.log(id);
              db.collection("records").doc(id).get().then((data) => {
              console.log("Database File->",id, data.data().csvData)
              readData( data.data().csvData);
            });
          }