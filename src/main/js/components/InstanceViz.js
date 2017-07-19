import React from 'react';

function chunk(arr, length) {
  const chunks = [];
  for (let i = 0; i < arr.length; i+=length) {
    chunks.push(arr.slice(i, i+length));
  }
  return chunks;
}

const DIMENSIONS ={
  BIG: {
    height: 20, width: 10, margin: 2
  },
  MEDIUM: {
    height: 12, width: 6, margin: 2
  },
  SMALL: {
    height: 6, width: 3, margin: 2
  }
};

class InstanceVizCanvas extends React.Component {
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
    if (this.props.tasks) {
      console.time('canvas-draw');
      const size = (this.props.tasks.length > 1000)
        ? 'SMALL'
        : (this.props.tasks.length > 100) ? 'MEDIUM' : 'BIG';
      const dimensions = DIMENSIONS[size];
      const ctx = this.refs.canvas.getContext('2d');
      const width = ctx.canvas.width;

      const itemsPerRow = Math.floor(width / (dimensions.width + dimensions.margin));
      const rows = chunk(this.props.tasks, itemsPerRow);
      ctx.canvas.height = Math.ceil(rows.length * (dimensions.height + dimensions.margin));

      rows.forEach((tasks, y) => {
        tasks.forEach((task, x) => {
          const xOff = x * dimensions.width + x * dimensions.margin;
          const yOff = y * dimensions.height + y * dimensions.margin;
          ctx.fillStyle ='#74C080';
          ctx.fillRect(xOff, yOff, dimensions.width, dimensions.height);
        });
      });
      console.timeEnd('canvas-draw');
    }
  }

  render() {
    return <div ref="container"><canvas ref="canvas" width={300} height={300} /></div>;
  }
}

const InstanceVizHTML = ({ instances }) => {
  const className = (instances.length > 1000)
    ? 'small'
    : (instances.length > 100) ? 'medium' : 'big';

  return (<ul className={`instance-grid ${className}`}>
    {instances.map((i) => (<li className={i.className} />))}
  </ul>);
};

export default InstanceVizHTML;
