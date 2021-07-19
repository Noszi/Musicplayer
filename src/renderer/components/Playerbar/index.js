import React, { Component } from 'react';
import './index.css';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaRandom, FaRetweet, FaPlay, FaPause } from 'react-icons/fa';
import img from './music.png';

export default class index extends Component {
	constructor() {
		super();
		this.state = {
			text: false
		}
	}

	componentDidMount() {
		if (this.props.data)
			if (this.props.data.title || this.props.data.artist) this.setState({text: true});
	}

	render() {
		var { current, duration, data, playing } = this.props;
		
		return (
			<div className="playerContainer">
				<div className="playerData">
					{data && <img src={data.picture ? 'data:image/png;base64,' + data.picture[0].data.toString('base64') : img} alt="asd" />}

					<div className="dataContainer">
						{data && (this.state.text ? (
							<div className="center">
								<div className="dataTitle">{data.title}</div>
								<div className="dataAuthor">{data.artist}</div>
							</div>
						) : 
							<div className="center">
								<div className="dataTitle">{data.name}</div>
							</div>
						)}
					</div>
				</div>
				
				<div className="playerPanel">
					<div className="panel">

						<div className={`playerBtn${this.props.shuffle ? ' active' : ''}`} onClick={() => this.props.handleShuffle()}>
							<FaRandom className="center" />
						</div>

						<div className="playerBtn" onClick={() => this.props.handlePrev()}>
							<FaAngleDoubleLeft className="center" />
						</div>

						<div style={{ margin: '0 10px' }} className="playerBtn">
							<div className="circle center" onClick={() => this.props.playPause()}>
								{!playing ? <FaPlay className="center" /> : <FaPause className="center" />}
							</div>
						</div>

						<div className="playerBtn" onClick={() => this.props.handleNext()}>
							<FaAngleDoubleRight className="center" />
						</div>
						
						<div className={`playerBtn${this.props.repeat ? ' active' : ''}`} onClick={() => this.props.handleRepeat()}>
							<FaRetweet className="center" />
						</div>
					</div>
				</div>

				<div className="playerWave">
					<div className="waveContainer center">
						<div className="time">
							<div className="center">{current}</div>
						</div>
						<div id="wave" />
						<div className="time">
							<div className="center">{duration}</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
