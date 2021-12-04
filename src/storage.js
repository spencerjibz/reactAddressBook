/* eslint-disable no-unused-vars */



class Storage {
constructor() {
   
this.ContactList = new Set();
this.OrgList = new Set();
this.Edit = false;
this.GlobalStore = localStorage["AdressBook"];
this.JsonStruct = function (fullname,phone,city,email,address,website,members) {
    this.fullname = fullname.trim();
    this.phone = phone;
    this.city = city!==null?city:undefined;
    this.email = email;
    this.address = address;
     this.members = !address&&members? new Set(...members):undefined
}

}
// clear()

Clear() {

// clear  
this.OrgList.clear();
this.ContactList.clear();
localStorage.clear()


}
// add organisation
AddOrg(CompanyName,Email,phoneNumber,website,city,members) { 
  
// no duplicate Contact named, check if a member with the sample name exists
let dups = [...this.OrgList].filter(v=> {
   
 return  v&&JSON.parse(v).fullname.trim()===CompanyName.trim()

});

   //console.log(dups,CompanyName)
if (dups&&dups.length>0) { 

   CompanyName = CompanyName + `-${(Math.round(dups.length+Math.random(0,1)*100))}`;
}

// create JSON Object
  let obj = new this.JsonStruct(CompanyName,phoneNumber,undefined,Email,undefined,website,members);
   obj.website = website;
   obj.members = members
// add the OrgList
  this.OrgList.add(JSON.stringify(obj));
 // call update or the GlobalStore
this.updateGlobalState()
 return true

}  
// 
// only to update : 
UpdateOrg(CompanyName,Email,phoneNumber,website,city,members) { 
 
// get the previous object
let PrevOrg = [...this.OrgList].filter(v=>v&&JSON.parse(v).fullname.trim()===CompanyName.trim())[0]
 
if (PrevOrg) { 
  PrevOrg = JSON.parse(PrevOrg)
// if we have news in the in memberObj, add them to the members list
if(members.length>0) { 
  //add new members to existing one
members = PrevOrg.members.concat(members);

}
// if there is not new members, return object with the same members as before
else { members = PrevOrg.members }

}
// no lists replace the Object with new object 

this.OrgList.delete(JSON.stringify(PrevOrg));

//  add new object 
//
//create JSON Object
  let obj = new this.JsonStruct(CompanyName,phoneNumber,undefined,Email,undefined,website,members);
   obj.website = website;
   obj.members = members
// add the OrgList
  this.OrgList.add(JSON.stringify(obj));
 // call update or the GlobalStore
this.updateGlobalState()
 return true



}
// update contacts function
UpdateContact(fullname,phone,city,email,address,Orgs) { 
  
// fi this contact and delete 
let dups = [...this.ContactList].filter(v=> v&&JSON.parse(v).fullname.trim()===fullname.trim())[0]
// delete previous
if (dups) { 
// delete this object from ContactSet
this.ContactList.delete(dups)
// update it with


let contact = new this.JsonStruct(fullname,phone,city,email,address,undefined,undefined);
     // add to Contact List     
     this.ContactList.add(JSON.stringify(contact))//
     // Add the contacts to OrgList if Orgs parameter is add
       if(Orgs&& Orgs.length>0) { 
     
       
     Orgs.forEach(e=>{
    
 
     
        let obj = [...this.OrgList].filter(v=>{
       
             return  v&&v!==null&&JSON.parse(v).fullname.trim()===e.trim()
        
        })[0]
     
        // parse
        obj = JSON.parse(obj)
       // update the members
       //remove previous
       this.OrgList.delete(JSON.stringify(obj));
// removes dupate
  let n = new Set([...obj.members])
  n.add(fullname)
    
        obj.members = [...n];

        this.OrgList.add(JSON.stringify(obj))



     } 
        )

       }
     // call update on GLobalStore  #

     this.updateGlobalState()
     return true

}



}




AddContact(fullname,phone,city,email,address,Orgs) {

  // no duplicate Contact named, check if a member with the sample name exists
  let dups = [...this.ContactList].filter(v=> v&&JSON.parse(v).fullname===fullname);
  //console.log(dups,fullname)
 
  if (dups&&dups.length>0) { 

     fullname = fullname + `-${Math.round(dups.length+Math.random(0,1)*100)}`;
  }
    // create JSON Object
     let contact = new this.JsonStruct(fullname,phone,city,email,address,undefined,undefined);
     // add to Contact List     
     this.ContactList.add(JSON.stringify(contact))//
     // Add the contacts to OrgList if Orgs parameter is add
       if(Orgs&& Orgs.length>0) { 
     
       
     Orgs.forEach(e=>{
    
 
     
        let obj = [...this.OrgList].filter(v=>{
       
             return  v&&v!==null&&JSON.parse(v).fullname.trim()===e.trim()
        
        })[0]
     
        // parse
        obj = JSON.parse(obj)
       // update the members
       //remove previous
       this.OrgList.delete(JSON.stringify(obj));
// removes dupate
  let n = new Set([...obj.members])
  n.add(fullname)
    
        obj.members = [...n];

        this.OrgList.add(JSON.stringify(obj))



     } 
        )

       }
     // call update on GLobalStore  #

     this.updateGlobalState()
     return true
    }

RemoveOrg(CompanyName) { 

// check if Orglist has this company
//console.log('remove'+CompanyName)
let obj = [...this.OrgList].filter(v=> {
    
     return v&&JSON.parse(v).fullname.trim()===CompanyName.trim()
    
    
})[0]

if (obj && this.OrgList.has(obj)) {
    // remove obj
    this.OrgList.delete(obj)
 // update Globalobjec
 this.updateGlobalState()
 // 
 return true
}
return false 
}
RemoveCont(fullname) {

    fullname =fullname.trim();
    let obj = [...this.ContactList].filter(v=>v&&JSON.parse(v).fullname.trim()===fullname.trim())[0]
    
if (obj && this.ContactList.has(obj)) {
    // remove obj
    this.ContactList.delete(obj)
 
    // remove this contact from any organisation with it
    let Obj = [...this.OrgList].filter(v=>v&&JSON.parse(v).members.includes(fullname)).forEach(e=>{ 
        this.OrgList.delete(e);
     let ele = JSON.parse(e);
      // find the indexOf(obj) 
       let n = ele.members.indexOf(fullname)
       ele.members.splice(n,1);
       // reset the members 
        this.OrgList.add(JSON.stringify(ele))
 
    })
    
 // update Globalobjec
  this.updateGlobalState()
 return true
}
return false 
}
// Remove members from Organisation 
RemoveFromOrg(member,CompanyName) { 
//  find the organisation
let org = [...this.OrgList].filter(v=> {
   
    return v&&JSON.parse(v).fullname.trim()===CompanyName.trim()
   
   
})[0];
// get obj object

if (org) {
    // delete previous objectt
    this.OrgList.delete(org)
org = JSON.parse(org);
// find and remove members from members Array
let ind= org.members.indexOf(member);

 // find
 org.members.splice(ind,1);
 // remove previous object and replace with new
 this.OrgList.add(JSON.stringify(org))
 
 // update GlobalStore
 this.updateGlobalState()


}






}



// update or init GlobalStore 
updateGlobalState () {  
  // if the localStorage alright contains data, just add to it
 

  if (this.ContactList.size>0||this.OrgList.size>0) {
// if the localstorage has this object update 
 // 
 
   localStorage["addressBook"] = JSON.stringify({Contacts:[...this.ContactList].filter(v=>v!==null),organisations:[...this.OrgList].filter(v=>v!==null)});
   this.GlobalStore = localStorage["addressBook"];
  
  }  else {
// there is no global create new  Set(); 


localStorage["addressBook"] = JSON.stringify({Contacts:[...this.ContactList].filter(v=>v!==null),organisations:[...this.OrgList].filter(v=>v!==null)});
this.GlobalStore = localStorage["addressBook"];

  }
 

}
init() { 
 if (localStorage["addressBook"]) { 
   //console.log("you called this first ")
     this.GlobalStore = localStorage["addressBook"];
     // extract information full
     let obj = JSON.parse(this.GlobalStore);
      for (let i in obj.organisations) { 
           this.OrgList.add(obj.organisations[i])
        

      }
  for (  let e in obj.Contacts) { 


    this.ContactList.add(obj.Contacts[e])
  }

 }

}


}

let storage = new Storage();
export default storage