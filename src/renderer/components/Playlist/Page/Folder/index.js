import React, { Component } from 'react'
import {ipcRenderer} from 'electron';
import {FaPlus, FaTrash, FaHeart, FaRegHeart} from 'react-icons/fa';

export default class index extends Component {
  render() {
    return (
        <div>
      <div className="btnContainer">
					<div className="btnLeft">
						<div className="btnAdd" onClick={() => ipcRenderer.send('openDialog')}>
							<FaPlus />
							<div className="btnText">Add files to list</div>
						</div>
					</div>
					<div className="btnRight">
						<div className="btnClear" onClick={() => this.props.clearList()}>
							<FaTrash />
							<div className="btnText">Clear list</div>
						</div>
					</div>
				</div>

				
				<div className="btnContainer">

				<div className="btnall">
						<div className="btnselectall"	onClick={() => this.props.selectall()}>
							<FaRegHeart />
							<div className="btnText">Select all</div>
						</div>
                    </div>
					<div className="btnnone">
						<div className="btnremove" onClick={() => this.props.selectnone()}>
							<FaHeart />
							<div className="btnText">Select none</div>
						</div>
					</div>

                </div>
                </div>
    )
  }
}
