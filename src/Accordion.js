import React, { Component } from "react"
import "./App.css"

class Content extends Component {
	constructor(props) {
		super(props)
		this.state = {
			open: false,
			editName: "",
			members: [],
		}
	}

	render() {
		let { handleAddBtn, members } = this.props

		return (
			<div className="col-sm-4 col-sm-offset-4">
				<div className="panel-group">
					<div className="panel panel-default">
						<div className="panel-heading">
							<h6 className="panel-title">
								{members.length > 0 ? (
									<button
										className="uk-button-default
                "
										onClick={function () {
											this.setState({
												open: !this.state
													.open,
											})
										}.bind(this)}>
										Show and manage members
									</button>
								) : (
									"No members yet "
								)}
							</h6>
						</div>
						<div
							className={
								this.state.open
									? "panel-collapse"
									: "panel-collapse panel-close"
							}>
							<ul className="uk-list list-group ">
								{" "}
								{members.length > 0
									? members.map((ele, i) => {
											return (
												<li
													key={i}
													className="list-group-item ">
													<div className="entry">
														<div className="name">
															{" "}
															{
																ele
															}{" "}
														</div>
														<div>
															<button
																className="btn-button uk-button-danger"
																name={
																	"remove" +
																	ele
																}
																onClick={
																	handleAddBtn
																}>
																Remove{" "}
															</button>
														</div>
													</div>
												</li>
											)
									  })
									: null}
							</ul>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
export default Content
