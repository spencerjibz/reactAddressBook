import Storage from "./storage"
async function SampleContact() {
	try {
		let contacts = await fetch(
			"https://jsonplaceholder.typicode.com/users"
		)
		let final = await contacts.json()
		return final
	} catch (err) {
		console.log(err)
	}
}
async function AddSamples() {
	let results = await SampleContact()
	// create 5 organisations

	if (results && Array.isArray(results)) {
		let arr = results.slice(0, 5)
		arr.forEach((e, i) => {
			//Storage.AddOrg()
			//Storage.AddOrg(companyName,email,phoneNumber,website,undefined,members)
			Storage.AddOrg(
				e.company.name,
				e.email,
				e.phone,
				e.website,
				undefined,
				[]
			)
		})
		// just add members to the

		arr = arr.map((v) => v.company.name)

		for (let members of results) {
			let { address, phone, company, email, name } = members
			let Orgs = []
			if (arr.includes(company.name)) {
				Orgs.push(company.name)
			} else {
				let ind = results.indexOf(members) % arr.length

				if (arr[ind]) {
					Orgs.push(arr[ind])
				}
				//
			}
			// time to create the contacts
			let ContactAddress = `${address.suite} ${address.street} \n ${address.zipcode} , ${address.city}`

			// //Storage.AddContact(fullrname,phoneNumber,city,email,address,Orgs)
			if (
				name &&
				phone &&
				ContactAddress &&
				email &&
				address &&
				Orgs.length > 0
			) {
				Storage.AddContact(
					name,
					phone,
					address.city,
					email,
					ContactAddress,
					Orgs
				)
			}
		}
		Storage.init()
	}
}

export default AddSamples
