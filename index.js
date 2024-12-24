// var state = {
//     tasklist:[
//         {
//             imageurl:"",
//             taskTitle:"",
//             taskDescripation:"",
//             taskType:""
//         },
//         {
//             imageurl:"",
//             taskTitle:"",
//             taskDescripation:"",
//             taskType:""
//         },
//         {
//             imageurl:"",
//             taskTitle:"",
//             taskDescripation:"",
//             taskType:""
//         },
//         {
//             imageurl:"",
//             taskTitle:"",
//             taskDescripation:"",
//             taskType:""
//         },
//         {
//             imageurl:"",
//             taskTitle:"",
//             taskDescripation:"",
//             taskType:""
//         },
//         {
//             imageurl:"",
//             taskTitle:"",
//             taskDescripation:"",
//             taskType:""
//         },
//     ]
// };



//tasklist is for backing up storage
const state = {
    taskList: [],
};
//DOM operations
const taskContents = document.querySelector(".task_contents");
const taskModal = document.querySelector(".task_modal_body");
//  console.log(taskContents);
//  console.log(taskModal);
//element identifier key =${id} is been missing  on line 50th
const htmltaskContents = ({ id, title, descripation, type, url }) => `
    <div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id}>
        <div class="card shadow-sm task_card">

        <div class="card-header  d-flex justify-content-end task_card_header">
                 <button type='button' class='btn btn-outline-primary mr-1.5' name=${id} onclick="edittask.apply(this, arguments)">
          <i class='fas fa-pencil-alt name=${id}'></i></button>
           <button type='button' class='btn btn-outline-danger mr-1.5' name=${id} onclick="deleteTask.apply(this, arguments)">
          <i class='fas fa-trash-alt name=${id}' ></i>
         </button>
        </div>
        <div class="card-body">
            ${
       // url &&
    // `<img width="100%" src=${url} alt="card Image" class="card_img_top md-3 rounded-lg"/> `
    url
    ?`<img width="100%" src=${url} alt="card Image" class="card_img_top md-3 rounded-lg"/> `
    :`<img width="100%" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKteJt4yIuQOY8dv1-oknm_gx4IRimwZ_rzOT0LY7NiFnd5JsBD8ofiiPhMGeaYpXEr-0&usqp=CAU" alt="card Image" class="card_img_top md-3 rounded-lg"/> `
    }
    <h4 class="card-title task_card_title">${title}</h4>
    <p class="description trim-3-lines text-muted">${descripation}</p>
    <div class="tags text-white d-flex flex-wrap">
    <span class="badge bg-primary m-1">${type}</span>
    </div>
        </div>
         <div class="card-footer">
        <button type="button" class="btn btn-outline-primary  float-right" data-bs-toggle="modal" data-bs-target="#showTask" onclick="openTask.apply(this, arguments)" id=${id}>Open Task</button>
        </div>
        </div>  
    </div>
 `;

 //modal body on >> click of open task
 const htmlModalContents = ({id,title,descripation,url}) =>{
    const date = new Date(parseInt(id));
    return `
    <div id=${id}>
        ${
    //         url &&
    // `<img width="100%" src=${url} alt="card Image" class="img-fluid place-holder_image mb-3"/> `
    url
    ?`<img width="100%" src=${url} alt="card Image" class="card_img_top md-3 rounded-lg"/> `
    :`<img width="100%"  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKteJt4yIuQOY8dv1-oknm_gx4IRimwZ_rzOT0LY7NiFnd5JsBD8ofiiPhMGeaYpXEr-0&usqp=CAU" alt="card Image" class="card_img_top md-3 rounded-lg"/> `
    }
    <strong class="text-muted text-sm">Created on :${date.toDateString()}</strong>
    <h2 class="my-3">${title}</h2>
    <p class="text-muted">${descripation}</p>
    </div>
    `;
 }
//where we convert json > str(i.e., for local storage) 
 const updateLocalStorage = ()=>{
    localStorage.setItem(
        "task",
        JSON.stringify({
            tasks:state.taskList,
        })
    );
 };

 //where we convert str .json (i.e.,for rendering the cards on the screen)
 const loadInitialData = ()=>{
    const localStorageCopy = JSON.parse(localStorage.task);
    if(localStorageCopy)state.taskList = localStorageCopy.tasks;
        state.taskList.map((cardDate)=>{
            taskContents.insertAdjacentHTML("beforeend",htmltaskContents(cardDate));
        });
     };

        //spread operator 
       //appending or adding new key into spread operator 

     //when we update or when we edit .. we need to save
     const handleSubmit = (event)=>{
       
            const id = `${Date.now()}`;
            const input ={
                url:document.getElementById("imageurl").value,
                title:document.getElementById("taskTitle").value,
                type:document.getElementById("tags").value,
                Descripation:document.getElementById("taskDescripation").value,
            };
            if(input.title===""|| input.type===""||input.Descripation===""){return alert("please fill the necessary field")};
           taskContents.insertAdjacentHTML("beforeend",htmltaskContents({...input,id})
        
        );

        state.taskList.push({...input,id}); 
        updateLocalStorage(); //having localstorage
     };
     //open task
     const openTask = (e) =>{
        if(!e) e = window.event;
        const getTask = state.taskList.find(({id})=>id === e.target.id);
        taskModal.innerHTML = htmlModalContents(getTask);
     };
     
     //  delete task
     const deleteTask = (e) =>{
        if(!e) e = window.event;
      const targetId = e.target.getAttribute("name");
    //   console.log(targetId); 
    const type = e.target.tagName;
        // console.log(type);
        const removeTask = state.taskList.filter(({id})=> id !== targetId)
        updateLocalStorage();

        if(type === "BUTTON"){
            return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
                e.target.parentNode.parentNode.parentNode
            );
        
        }
       return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode.parentNode)
     };
     //Edit task
     const edittask = (e) => {
        if(!e) e =window.event;
        
        const targetId =e.target.id;
        const type =e.target.tagName;

        let parentNode;
        let taskTitle;
        let taskDescripation;
        let taskType;
        let submitButton;

        if (type === "BUTTON"){
            parentNode = e.target.parentNode.parentNode;
        }
        else{
            parentNode = e.target.parentNode.parentNode.parentNode;
        }
        // taskTitle = parentNode.childNodes[3].childNodes[7].childNodes
        // ;
        // console.log(taskTitle);

        taskTitle = parentNode.childNodes[3].childNodes[3];
        taskDescripation = parentNode.childNodes[3].childNodes[5];
        taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
        submitButton = parentNode.childNodes[5].childNodes[1];

        // console.log(taskTitle, taskDescripation, taskType,submitButton);

        taskTitle.setAttribute("contenteditable","true");
        taskDescripation.setAttribute("contenteditable","true");
        taskType.setAttribute("contenteditable","true");
        

        submitButton.setAttribute("onclick","saveEdit.apply(this,arguments)");
        submitButton.removeAttribute("data-bs-toggle");
        submitButton.removeAttribute("data-bs-target");
        submitButton.innerHTML = "save changes";
     };
      // save edit
     const saveEdit = (e) =>{
        if(!e) e = window.event;

        const targetId = e.target.id;
        const parentNode = e.target.parentNode.parentNode;
        // console.log(parentNode.childNodes);

       const taskTitle = parentNode.childNodes[3].childNodes[3];
       const taskDescripation = parentNode.childNodes[3].childNodes[5];
       const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
       const submitButton = parentNode.childNodes[5].childNodes[1];

       const updateData = {
        taskTitle:taskTitle.innerHTML,
        taskDescripation: taskDescripation.innerHTML,
        taskType: taskType.innerHTML
       };
       let stateCopy = state.taskList;
       stateCopy = stateCopy.map((task)=> task.id === targetId ? {
        id:task.id,
        title:updateData.taskTitle,
        descripation:updateData.taskDescripation,
        url:task.url,
        type:updateData.taskType,
       }
       :task
       );
       state.taskList = stateCopy;
       updateLocalStorage();


       taskTitle.setAttribute("contenteditable","false");
        taskDescripation.setAttribute("contenteditable","false");
        taskType.setAttribute("contenteditable","false");
        submitButton.setAttribute("onclick","openTask.apply(this, arguments)");
        submitButton.setAttribute("data-bs-toggle","modal");
        submitButton.setAttribute("data-bs-target","#showTask");   
        submitButton.innerHTML ="open Task";
        


     };

     //search 
     const searchTask =(e)=> {
        if(!e)e = window.event;
        while(taskContents.firstChild){
            taskContents.removeChild(taskContents.firstChild);
        }
        const resultData = state.taskList.filter(({title}) =>
            title.toLowerCase().includes(e.target.value.toLowerCase())
        );
        // console.log(resultData);
        resultData.map((cardData) =>{
            taskContents.insertAdjacentHTML("beforeend",htmltaskContents(cardData))
        });
        
     };

// git checkout -b "put the branch here"
// git add .
// git commit -m ""
// git push



