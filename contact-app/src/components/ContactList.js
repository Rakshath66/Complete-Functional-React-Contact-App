import React, {useRef} from "react";
import {Link} from "react-router-dom";
import ContactCard from "./ContactCard";

const ContactList = (props) => {

    const input1= useRef("");
    //handler passed from app to here to get id
    const deleteContactHandler =(id) => {
        props.getContactId(id);
    }

    //create list and render list
    const renderContactList = props.contacts.map((contact) => {
        return (<ContactCard contacts={contact} clickHandler={deleteContactHandler} key={contact.id}></ContactCard>);
    });

    const getSearchTerm=()=>{
        // console.log(input1.current.value);
        props.searchKeyword(input1.current.value);
    };//can also done with event.target

    return (

        <div class="main">
            <h2>Contact List
                <Link to="/add">
                <button className="ui button blue right">Add Contact</button>
                </Link>
            </h2>

            {/* //can write event.target.value in onchange, instead of that using useref hook, bind useref hook with input tag */}
            <input 
              ref={input1}
              type="text" placeholder="Search Contacts" className="prompt" value={props.term} onChange={getSearchTerm}/>
            <i className="search icon"></i>
             
            <div className="ui celled list">{renderContactList.length >0 ? renderContactList:"No contacts available"}</div>
        </div>
    );
}

export default ContactList;
