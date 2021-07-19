import React, { Component } from 'react';
import './index.css';
import { FiSquare, FiX, FiMinus } from 'react-icons/fi';
import { ipcRenderer } from 'electron';

export default class index extends Component {
	render() {
		return (
			<div className="navContainer">
				<div className="navBtn">
					<FiX onClick={() => ipcRenderer.send('closeWindow')} />
				</div>
				<div className="navBtn">
					<FiSquare onClick={() => ipcRenderer.send('resizeWindow')} />
				</div>
				<div className="navBtn">
					<FiMinus onClick={() => ipcRenderer.send('minimizeWindow')} />
				</div>
			</div>
		);
	}
}
