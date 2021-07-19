import React, { Component } from 'react';
import './index.css';
import * as mm from 'music-metadata';
import { FaCompactDisc, FaTrash, FaPlay, FaHeart } from 'react-icons/fa';

export default class index extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null
		};
	}

	componentDidMount() {
		var v = this.props.item;
		mm.parseFile(v).then((data) => {
			data.common['name'] = v.substring(v.lastIndexOf('\\') + 1, v.indexOf('.'));
			this.setState({
				data: {
					author: data.common.artist || '',
					title: data.common.title || data.common.name
				}
			});
		});
	}
	render() {
		var { data } = this.state;
		return (
			data && (
				<div className="itemContainer">
					<div
						className="itemActive"
						style={this.props.active ? { animation: 'rotate infinite 1s linear' } : {}}
					>
						<FaCompactDisc className="center" style={!this.props.active && { display: 'none' }} />
					</div>
					{data.title ? (
						<div className="itemData">{data.title}</div>
					) : (
						<div className="itemData">{data.author}</div>
					)}
					{!data.title ? (
						<div className="itemData">{data.title}</div>
					) : (
						<div className="itemData">{data.author}</div>
					)}
					<FaPlay className="itemPlay" onClick={() => this.props.play()} />
					{this.props.selected != -3 && <FaHeart
						className="itemFavorite"
						style={this.props.liked && { color: 'red' }}
						onClick={() => this.props.like()}
					/>}
					<FaTrash className="itemDelete" onClick={() => this.props.remove()} />
					<div className="itemLine" />
				</div>
			)
		);
	}
}
