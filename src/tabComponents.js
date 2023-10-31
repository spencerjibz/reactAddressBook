import React, { Component } from "react";
import LoadSamples from "./LoadSampleData";
import Storage from "./storage";
import Content from "./Accordion";
class People extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addNew: false,
      fullname: "",
      email: "",
      phoneNumber: "",
      address: "",
      city: "",
      Orgs: [],
      editMode: false,
      editName: "",
    };
    this.handleEntries = this.handleEntries.bind(this);
    this.handleAddBtn = this.handleAddBtn.bind(this);
  }

  handleEntries(e) {
    if (e.target.name.includes("addTo") && !e.target.value.includes("None")) {
      let { value } = document.getElementById("selector");
      let arr = [...this.state.Orgs, value];
      this.setState({ Orgs: [...new Set(arr)] });
    }
    this.setState({ [e.target.name]: e.target.value });
  }
  // One only function to handle all button events on the each component
  handleAddBtn(e) {
    if (e.target.name.includes("cancel")) {
      e.preventDefault();
      this.setState({ addNew: false, editMode: false });
    } else if (e.target.name.includes("Add")) {
      e.preventDefault();

      let { fullname, email, phoneNumber, address, city, Orgs } = this.state;

      if (fullname && email && phoneNumber && address && city) {
        // if the following object exists from remove it
        if (this.state.editMode && this.state.editName.length > 0) {
          Storage.UpdateContact(
            fullname,
            phoneNumber,
            city,
            email,
            address,
            Orgs,
          );
          this.setState({
            addNew: false,
            editMode: false,
            fullname: "",
            email: "",
            phoneNumber: "",
            address: "",
            city: "",
            Orgs: [],
          });
        } else {
          // now u
          Storage.AddContact(fullname, phoneNumber, city, email, address, Orgs);
          // rest state
          this.setState({
            addNew: false,
            editMode: false,
            fullname: "",
            email: "",
            phoneNumber: "",
            address: "",
            city: "",
            Orgs: [],
          });
          // clear in input
        }
      } else {
        // return an error
      }
    } else if (e.target.name.includes("delete")) {
      //  extract the full of the organisation
      let name = e.target.name.replace("delete", "");

      Storage.RemoveCont(name);
      // rest state

      this.setState({ addNew: false, editMode: false });
    } else if (e.target.name.includes("edit")) {
      // enable editing
      let name = e.target.name.replace("edit", "");
      // find the following in the storage
      let Obj = JSON.parse(Storage.GlobalStore).Contacts.filter(
        (v) => v !== null && v.includes(name),
      )[0];
      Obj = JSON.parse(Obj);
      this.setState({
        addNew: true,
        phoneNumber: Obj.phone,
        address: Obj.address,
        city: Obj.city,
        fullname: Obj.fullname,
        email: Obj.email,
      });

      this.setState({ editMode: true, editName: name });
    }
    // adding Sample Data
    else if (e.target.name.includes("sample")) {
      let Obj = localStorage["addressBook"]
        ? JSON.parse(localStorage["addressBook"])
        : undefined;

      //// lets add some sample information if there is none  in the Globalstore
      if (
        !localStorage["addressBook"] ||
        (Obj && Obj.organisations.length < 2 && Obj.Contacts.length < 2)
      ) {
        // //Storage.AddContact(fullname,phoneNumber,city,email,address,Orgs)
        LoadSamples();
        //Storage.init()
        // with for sample information to load
        setTimeout(() => {
          this.props.history.push("/people");
        }, 200);

        //console.log(this.props.history)
      }
    } else {
      this.setState({ addNew: true, editMode: false, editName: "" });
    }
  }
  render() {
    let Obj = Storage.GlobalStore
      ? JSON.parse(Storage.GlobalStore).Contacts
      : [];
    let OrgList = Storage.GlobalStore
      ? JSON.parse(Storage.GlobalStore)
          .organisations.map(JSON.parse)
          .filter((v) => v !== null)
          .map((v) => v.fullname)
      : [];
    return (
      <div>
        <div className="quickadd">
          <button
            onClick={this.handleAddBtn.bind(this)}
            className="uk-button"
            id="QuickAdd"
          >
            + Add New
          </button>
          <button
            onClick={this.handleAddBtn.bind(this)}
            className="uk-button"
            id="QuickAdd"
            name="sampledata"
          >
            Add Sample Data
          </button>
        </div>

        {this.state.addNew ? (
          <form className="uk-grid-small" uk-grid="true">
            <div className="uk-width-1-1">
              <input
                className="uk-input"
                type="text"
                name="fullname"
                disabled={this.state.editMode}
                value={this.state.fullname}
                onChange={this.handleEntries}
                placeholder={
                  this.state.editMode ? this.state.fullname : "Full Name"
                }
              />
            </div>
            <div className="  uk-width-1-2@s">
              <input
                className="uk-input"
                type="email"
                name="email"
                value={this.state.email}
                onChange={this.handleEntries}
                placeholder={
                  this.state.editMode ? this.state.email : " Email Address "
                }
              />
            </div>
            <div className="uk-width-1-2@s">
              <input
                className="uk-input"
                type="text"
                placeholder={
                  this.state.editMode
                    ? this.state.phoneNumber
                    : "Phone Number  "
                }
                name="phoneNumber"
                value={this.state.phoneNumber}
                onChange={this.handleEntries}
              />
            </div>

            <div className="uk-width-1-2@s">
              <textarea
                className="uk-textarea"
                rows="5"
                placeholder={
                  this.state.editMode ? this.state.email : "Enter Address"
                }
                name="address"
                value={this.state.address}
                onChange={this.handleEntries}
              ></textarea>
            </div>
            <div className="uk-width-1-2@s">
              <input
                className="uk-input"
                type="text"
                placeholder={this.state.editMode ? this.state.city : "City"}
                name="city"
                value={this.state.city}
                onChange={this.handleEntries}
              />
            </div>

            <div className="uk-width-1-2@s">
              <div uk-form-custom="target: true">
                <select
                  onClick={this.handleEntries.bind(this)}
                  name="addToOrgs"
                  id="selector"
                >
                  {OrgList.length > 0 ? (
                    OrgList.map((v, i) => <option key={i}>{v}</option>)
                  ) : (
                    <option>None</option>
                  )}
                </select>
                <button type="button" className="uk-button">
                  {" "}
                  Add to Organisation from List
                </button>
              </div>
            </div>

            <div className="uk-width-1-4@s">
              <button
                className="uk-button uk-button"
                name="Add"
                onClick={this.handleAddBtn.bind(this)}
              >
                Add or Update Now
              </button>
            </div>

            <div className="uk-width-1-4@s">
              <button
                className="uk-button"
                name="cancel"
                onClick={this.handleAddBtn.bind(this)}
              >
                {" "}
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        <br />
        {!this.state.addNew ? (
          <ul className="uk-list list-group  ">
            <li key={0} className="list-group-item ">
              <div className="entry ">
                <div className="name">
                  <strong>
                    <p>Full name</p>
                  </strong>
                </div>
                <div className="email">
                  {" "}
                  <strong>
                    <p>Email</p>
                  </strong>
                </div>
                <div className="phone">
                  <strong>
                    <p>PhoneNumber</p>
                  </strong>
                </div>
                <div className="address">
                  {" "}
                  <strong>
                    <p>Address</p>
                  </strong>
                </div>

                <div className="city">
                  {" "}
                  <strong>
                    <p>City</p>
                  </strong>
                </div>
              </div>
            </li>
            {Obj && Obj.length > 0
              ? Obj.map((e) => JSON.parse(e))
                  .filter((e) => e !== null)
                  .map((v, i) => {
                    return (
                      <li key={i} className="list-group-item">
                        {" "}
                        <div className="entry">
                          <div className="name">
                            <p>{v.fullname}</p>
                          </div>
                          <div className="email">
                            <p>{v.email}</p>
                          </div>
                          <div className="phone">
                            <p>{v.phone}</p>
                          </div>
                          <div className="address">
                            <p>{v.address}</p>
                          </div>
                          <div className="city">
                            <p>{v.city}</p>
                          </div>

                          <button
                            className="btn-button uk-button-primary"
                            name={"edit" + v.fullname}
                            onClick={this.handleAddBtn.bind(this)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn-button uk-button-danger"
                            name={"delete" + v.fullname}
                            onClick={this.handleAddBtn.bind(this)}
                          >
                            Delete Contact
                          </button>
                        </div>
                      </li>
                    );
                  })
              : null}
          </ul>
        ) : null}
        <hr className="uk-divider-icon"></hr>
      </div>
    );
  }
}

class Organisation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addNew: false,
      companyName: "",
      email: "",
      phoneNumber: "",
      website: "",
      members: [],
      editMode: false,
      editName: "",
    };
    this.handleEntries = this.handleEntries.bind(this);
    this.handleAddBtn = this.handleAddBtn.bind(this);
  }

  handleEntries(e) {
    if (e.target.name.includes("addTo") && !e.target.value.includes("None")) {
      //let {value} = document.getElementById('selector')
      let { value } = e.target;

      // add only members that already exist in the organisation
      // get this Organisation
      let dups = JSON.parse(Storage.GlobalStore).organisations.filter(
        (v) =>
          v && (v !== null) & (JSON.parse(v).fullname === this.state.editName),
      );
      let members = dups ? JSON.parse(dups).members : undefined;

      if (
        members &&
        !members.includes(value) &&
        !this.state.members.includes(value)
      ) {
        let arr = [...this.state.members, value];
        this.setState({ members: [...new Set(arr)] });
      }
      // donothing
    }
    this.setState({ [e.target.name]: e.target.value });
  }
  // One only function to handle all button events on the each component
  handleAddBtn(e) {
    if (e.target.name.includes("cancel")) {
      e.preventDefault();
      this.setState({ addNew: false, editMode: false });
    } else if (e.target.name.includes("Add")) {
      e.preventDefault();
      // add a new Organisation
      // check if there enough input and every value has a length > 5

      let { companyName, email, phoneNumber, website, members } = this.state;

      if (companyName && email && phoneNumber && website) {
        if (this.state.editMode && this.state.editName.length > 0) {
          Storage.UpdateOrg(
            companyName,
            email,
            phoneNumber,
            website,
            undefined,
            members,
          );

          this.setState({
            addNew: false,
            companyName: "",
            email: "",
            phoneNumber: "",
            website: "",
            members: [],
            editMode: false,
            editName: "",
          });
          // return now state
        } else {
          Storage.AddOrg(
            companyName,
            email,
            phoneNumber,
            website,
            undefined,
            members,
          );
          // rest state
          this.setState({
            addNew: false,
            companyName: "",
            email: "",
            phoneNumber: "",
            website: "",
            members: [],
            editMode: false,
            editName: "",
          });
          // clear in input
        }
      }
    } else if (e.target.name.includes("delete")) {
      //  extract the full of the organisation
      let name = e.target.name.replace("delete", "");

      Storage.RemoveOrg(name);
      // rest state

      this.setState({ addNew: false });
    } else if (e.target.name.includes("edit")) {
      // enable editing
      let name = e.target.name.replace("edit", "");
      // find the following in the storage
      let Obj = JSON.parse(Storage.GlobalStore).organisations.filter(
        (v) => v !== null && v.includes(name),
      )[0];
      Obj = JSON.parse(Obj);
      this.setState({
        addNew: true,
        phoneNumber: Obj.phone,
        companyName: Obj.fullname,
        email: Obj.email,
        website: Obj.website,
      });

      this.setState({ editMode: true, editName: name });
    } else if (e.target.name.includes("remove")) {
      // remove the members from the Organisation
      let memberName = e.target.name.replace("remove", "");

      // remove update

      Storage.RemoveFromOrg(memberName, this.state.editName);
      this.setState({ addNew: false, editMode: false });
    } else {
      this.setState({ addNew: true, editMode: false });
    }
  }
  // React -condititonal rendering with tenanary if statement(Short-hand)
  render() {
    let Obj = Storage.GlobalStore
      ? JSON.parse(Storage.GlobalStore).organisations
      : [];
    let OrgList = Storage.GlobalStore
      ? JSON.parse(Storage.GlobalStore)
          .Contacts.map(JSON.parse)
          .filter((v) => v !== null)
          .map((v) => v.fullname)
      : [];
    Obj = Obj.map((e) => JSON.parse(e)).filter((e) => e !== null); // remove null
    let found = this.state.editMode
      ? Obj.filter((v) => v.fullname === this.state.editName)[0]
      : {};
    let membs = found && found.members ? found.members : [];

    return (
      <div>
        <div className="quickadd">
          <button
            onClick={this.handleAddBtn.bind(this)}
            className="uk-button"
            id="QuickAdd"
          >
            + Add
          </button>
        </div>

        {this.state.addNew ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="uk-grid-small"
            uk-grid="true"
          >
            <div className="uk-width-1-1">
              <input
                className="uk-input"
                type="text"
                disabled={this.state.editMode}
                name="companyName"
                placeholder={
                  this.state.editMode
                    ? this.state.companyName
                    : "Name of Your Organisation"
                }
                value={this.state.companyName}
                onChange={this.handleEntries}
              />
            </div>
            <div className="  uk-width-1-2@s">
              <input
                className="uk-input"
                type="email"
                name="email"
                placeholder={
                  this.state.editMode
                    ? this.state.email
                    : "Company Email Address "
                }
                value={this.state.email}
                onChange={this.handleEntries}
              />
            </div>
            <div className="uk-width-1-4@s">
              <input
                className="uk-input"
                type="text"
                name="phoneNumber"
                placeholder={
                  this.state.editMode ? this.state.phoneNumber : "PhoneNumber "
                }
                value={this.state.phoneNumber}
                onChange={this.handleEntries}
              />
            </div>

            <div className="uk-width-1-2@s">
              <input
                className="uk-input"
                type="text"
                placeholder={
                  this.state.editMode ? this.state.website : "Website"
                }
                name="website"
                value={this.state.website}
                onChange={this.handleEntries}
              />
            </div>
            <div className="uk-width-1-2@s">
              <div uk-form-custom="target: true">
                <select
                  name="addTo"
                  onClick={this.handleEntries.bind(this)}
                  id="selector"
                >
                  {OrgList.length > 0 ? (
                    OrgList.map((v, i) => <option key={i}>{v}</option>)
                  ) : (
                    <option>None</option>
                  )}
                </select>
                <button type="button" className="uk-button">
                  {" "}
                  Add Members from Contact List
                </button>
              </div>
            </div>
            <div className="uk-width-1-2@s">
              <button
                onClick={() => this.props.history.push("/people")}
                className="uk-button"
              >
                {" "}
                Add New Member
              </button>
            </div>
            <div className="uk-width-1-4@s">
              <button
                className="uk-button uk-button"
                name="Add"
                onClick={this.handleAddBtn.bind(this)}
              >
                Add or Update Now
              </button>
            </div>

            <div className="uk-width-1-4@s">
              <button
                className="uk-button"
                name="cancel"
                onClick={this.handleAddBtn.bind(this)}
              >
                {" "}
                Cancel
              </button>
            </div>
          </form>
        ) : null}
        {/* list the organisations if the your isn't editing
         */}

        <br />
        {!this.state.addNew ? (
          <ul className="uk-list   list-group ">
            <li key={0} className="list-group-item ">
              <div className="entry ">
                <div className="name">
                  <strong>
                    <p>Company Name</p>
                  </strong>
                </div>
                <div className="email">
                  {" "}
                  <strong>
                    <p>Email</p>
                  </strong>
                </div>
                <div className="phone">
                  <strong>
                    <p>PhoneNumber</p>
                  </strong>
                </div>
                <div className="website">
                  {" "}
                  <strong>
                    <p>Website</p>
                  </strong>
                </div>

                <div className="members">
                  {" "}
                  <strong>
                    <p>Number of Members</p>
                  </strong>
                </div>
              </div>
            </li>

            {Obj && Obj.length > 0
              ? Obj.map((v, i) => {
                  // remove duplicates
                  v.members = [...new Set(v.members)];
                  return (
                    <div key={i}>
                      {" "}
                      <li key={i} className="list-group-item">
                        <div className="entry ">
                          <div className="name">
                            <p>{v.fullname}</p>
                          </div>
                          <div className="email">
                            <p>{v.email}</p>
                          </div>
                          <div className="phone">
                            <p>{v.phone}</p>
                          </div>
                          <div className="website">
                            <p>{v.website}</p>
                          </div>

                          {v.members ? (
                            <div className="members">
                              <p>
                                {v.members.length > 1
                                  ? v.members.length + " members"
                                  : v.members.length === 1
                                  ? "1 member"
                                  : "No members"}
                              </p>
                            </div>
                          ) : null}

                          <div className="btn-group phone ">
                            <button
                              className="btn-button uk-button-primary"
                              name={"edit" + v.fullname}
                              onClick={this.handleAddBtn.bind(this)}
                            >
                              Edit
                            </button>

                            <button
                              className="btn-button uk-button-danger"
                              name={"delete" + v.fullname}
                              onClick={this.handleAddBtn.bind(this)}
                            >
                              Delete{" "}
                            </button>
                          </div>
                        </div>
                      </li>
                    </div>
                  );
                })
              : null}
          </ul>
        ) : null}
        <hr className="uk-divider-icon"></hr>

        {/* Organsation  can  remove members  if there is any   */}

        {this.state.editMode ? (
          <div>
            <Content
              handleAddBtn={this.handleAddBtn}
              members={membs}
              editName={this.state.editName}
            ></Content>
          </div>
        ) : null}
      </div>
    );
  }
}

export { People, Organisation };
