import React, { Component } from 'react'
import {FaPlay, FaTrash} from 'react-icons/fa';

export default class index extends Component {

  render() {
    
    return (
      
      this.props.list.map((v, i) => {
        return (
          <div key={i} className="itemContainer">
            <div className="itemData">{v}</div>
            <FaPlay className="itemPlay" onClick={() => this.props.callpl(v)} />
            <FaTrash className="itemDelete" onClick={() => this.props.deletepl(v)} />
            <div className="itemLine" />
			    </div>
        )
      })
    )
  }
}
