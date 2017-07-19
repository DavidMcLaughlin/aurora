import React from 'react';

export default class Chart extends React.Component {
  componentDidMount() {
    // this.refs.canvas.getContext('2d').canvas.width = this.refs.container.width;
    this.refs.canvas.width = this.refs.container.offsetWidth;
    this.draw();
  }

  componentDidUpdate(props, nextProps) {
    if (props.tasks !== props.nextProps) {
      this.draw();
    }
  }

  draw() {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "steelblue";
    ctx.moveTo(10, 10);
    ctx.lineTo(20, Math.floor((Math.random() * 100) + 1));
    ctx.lineTo(50, Math.floor((Math.random() * 100) + 1));
    ctx.lineTo(100, Math.floor((Math.random() * 100) + 1));
    ctx.lineTo(150, Math.floor((Math.random() * 100) + 1));
    ctx.lineTo(200, Math.floor((Math.random() * 100) + 1));
    ctx.lineTo(250, Math.floor((Math.random() * 100) + 1));
    ctx.lineTo(300, Math.floor((Math.random() * 100) + 1));
    ctx.stroke();
  }

  render() {
    return <div ref="container"><canvas ref="canvas" width={300} height={120} /></div>;
  }
}