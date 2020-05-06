const dims = {
  width: 1060,
  height: 800
};

const margin = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20
}

const graphWidth = dims.width - margin.left - margin.right;
const graphHeight = dims.height - margin.top - margin.bottom

const svg = d3.select('.canvas').append('svg')
  .attr('width',dims.width)
  .attr('height', dims.height);

const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate (${margin.left}, ${margin.top})`);

// color scale
const color = d3.scaleOrdinal(d3['schemeSet2'])

const stratify = d3.stratify()
  .id(d => d.name)
  .parentId(d => d.parent)

const rootNode = stratify(data)
  .sum(d => d.amount); // add up the values

const pack = d3.pack()
  .size([graphWidth - 100, graphHeight- 100])
  .padding(5); // gap between bubbles

// this is the data we will pass in to create graph
console.log(pack(rootNode).descendants())

// join data and add group for each node
const nodes = graph.selectAll('g')
  .data(pack(rootNode).descendants())
  .enter()
  .append('g')
    .attr('transform', d => `translate(${d.x}, ${d.y})`);

// append circles
nodes.append('circle')
  .attr('r', d => d.r)
  .attr('stroke', 'white')
  .attr('stroke-width', 2)
  .attr('fill', d => color(d.depth));

// append text to small circles (only ones with no children)
nodes.filter(d => !d.children)
  .append('text')
  .attr('text-anchor', 'middle')
  .attr('dy', '0.3rem')
  .attr('fill', 'white')
  .style('font-size', d => d.value*4)
  .text(d => d.data.name);
    
