import React,{useState, useEffect} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import { v4 as uuid } from "uuid";
import api from '../api/contact';
import "./App.css";
import ContactDetail from "./ContactDetail";

//import 3 components
import Header from "./Header"
import AddContact from "./AddContact"
import ContactList from "./ContactList"
import EditContact from "./EditContact";
import { Switch } from "react-router-dom/cjs/react-router-dom.min";

function App() {
  const [contacts,setContacts] = useState([]);
  const [searchTerm, setSearchTerm]=useState("");
  const [searchResults, setSearchResults]=useState([]);

  //getting inputs of form from child to parent, by sending handler to child
  // const addContactHandler = (contact) => {
  //   console.log(contact);
  //   // setContacts([...contacts, contact]); 
  //   setContacts([...contacts, {id : uuid(), ...contact}]);
  // };
  const addContactHandler = async(contact) => {
    console.log(contact);
    const request ={
      id:uuid(),
      ...contact,
    };

    const response= await api.post("/contacts",request);
    setContacts([...contacts, response.data]);
  };

  const updateContactHandler = async (contact) => {
    const response= await api.put(`/contacts/${contact.id}`,contact)
    // console.log(response.data);
    const {id}=response.data
    setContacts(contacts.map(contact => {return contact.id === id ? {...response.data} : contact}));
  };


  //passing handler to get which id should be removed
  // const removeContactHandler = (id) => {
  //   const remainingContactList = contacts.filter((contact) => {
  //     return contact.id !== id;
  //   });

  //   setContacts(remainingContactList);//save remaining data
  // }
  const removeContactHandler = async(id) => {
    await api.delete(`/contacts/${id}`);
    const remainingContactList = contacts.filter((contact) => {
      return contact.id !== id;
    });

    setContacts(remainingContactList);//save remaining data
  }

  const retrievecontacts= async() => {
    const response =await api.get("/contacts");
    return response.data;
  }

  const searchHandler= (searchTerm) => {
    setSearchTerm(searchTerm);
    if(searchTerm!=="")
    {
      const newContactList=contacts.filter((contact) => {
        return Object.values(contact)
               .join("")
               .toLowerCase()
               .includes(searchTerm.toLowerCase());
      });
      setSearchResults(newContactList);
    }
    else
    {
      setSearchResults(contacts);
    }
  };

  const LOCAL_STORAGE_KEY="contacts";
  useEffect(() => {
    const getAllContacts = async() => {
      const allContacts= await retrievecontacts();
      if(allContacts) setContacts(allContacts);
    }
    getAllContacts();
    }, []);

  useEffect(() => {
    // localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts))
  }, [contacts]);
   
  
  return (

    <div className="ui container">
        
        <Router>
            <Header />

        <Switch>
            {/* <Route path="/" exact component={() => <ContactList contacts={contacts} getContactId={removeContactHandler}/>} />
            <Route path="/add" component={() => <AddContact addContactHandler={addContactHandler}/>} /> */}
            {/* <Route path="/add" component={AddContact} />
            <Route path="/" exact component={ContactList} /> */}

            <Route path="/" exact render={(props) =>  <ContactList {...props} 
            contacts={searchTerm.length < 1 ? contacts: searchResults} 
            getContactId={removeContactHandler} term={searchTerm} searchKeyword={searchHandler}/>}/>
            <Route path="/add" render={(props) => <AddContact {...props} addContactHandler={addContactHandler}/>}/> 
            <Route path="/edit" render={(props) => <EditContact {...props} updateContactHandler={updateContactHandler}/>}/> 

            {/* //Route to particular id */}
            <Route path="/contact/:id" component={ContactDetail} />


        </Switch>
            
            {/* pass props(handler) in component in router using arrow function, component={addcontact} */}
            
            {/* <AddContact addContactHandler={addContactHandler}/>
            <ContactList contacts={contacts} getContactId={removeContactHandler} /> */}
        </Router>

    </div>
  );
}

export default App;
