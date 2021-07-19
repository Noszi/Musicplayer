import React, { Component } from 'react';
import './index.css';
import { FaHeart, FaBlackberry, FaVolumeUp, FaSave } from 'react-icons/fa';

export default class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: -2,
			volume: 100
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.props.setVolume(event.target.value);
		this.setState({
			volume: parseInt(event.target.value)
		})
	}

	render() {
		var { current } = this.props;
		return (
			<div className="menuContainer">
				<div
					className={`menuItem ${current == -2 ? 'selected' : ''}`}
					onClick={() => this.props.pageSelect(-2)}
				>
					<FaBlackberry />
					<div className="itemName">Folder</div>
				</div>
				<div
					className={`menuItem ${current == -1 ? 'selected' : ''}`}
					onClick={() => this.props.pageSelect(-1)}
				>
					<FaHeart />
					<div className="itemName">Playlist</div>
				</div>

				<div
					className={`menuItem ${current == -3 ? 'selected' : ''}`}
					onClick={() => this.props.pageSelect(-3)}
				>
					<FaSave />
					<div className="itemName">Saved PL</div>
				</div>
				<div className="menuVolume">
					<FaVolumeUp />
					<div className="volumeContainer">
						<input  type="range" name="range" value={this.state.volume} max="100" min="0" className="volumeBar center" onChange={this.handleChange}/>
					</div>
				</div>
			</div>
		);
	}
}
