{
  'use strict';
  
  //setup map
  const viz = L.map('leaf').setView([51.489445, -0.070510],9);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZ2ptY24iLCJhIjoiY2oyYm84YWdoMDAxdzMzbjAzZm9sc2JrMCJ9.GZPGwFCvmebsZQqZr0M2sw'
  }).addTo(viz);

  d3.json(`./london-maps/london_boroughs_5pct.json`).then( mapData => {

    const opacity = 0.7;

    //fake impact data
    const center = -Math.random()*0.5;
    const polish = x => Math.round(Math.min(Math.max(x,0), 100));
    const impact = mapData.features.map(feat => {
      let x = feat.geometry.coordinates[0][0][0];
      return polish(90 - Math.abs(x - center)*200 + 10*Math.random());
    });
    const upper = impact.map(x => polish(x*1.3*(1 + (Math.random() - 0.6)*0.4)));
    const lower = impact.map(x => polish(x*0.7*(1 + (Math.random() - 0.6)*0.4)));
    const sortedInds = impact.map((x,i) => i);
    sortedInds.sort((a,b) => impact[b] - impact[a]);
    
    //hardcode the two boros with highest impact
    lower[sortedInds[0]] = polish(impact[sortedInds[0]]-70);
    upper[sortedInds[0]] = polish(impact[sortedInds[0]]+8);
    lower[sortedInds[1]] = polish(impact[sortedInds[1]]-8);
    upper[sortedInds[1]] = polish(impact[sortedInds[1]]+8);

    const Names = mapData.features.map(f => f.properties.name);
    const sc = d3.scaleLinear()
      .domain([0,100])
      .range([0,1]);

    //Leaflet map
    let polys = mapData.features.map(feat => {
      let p = feat.geometry.coordinates[0]
      p = p.map(row => [row[1], row[0]]);
      return p;
    });
    PolyObj = new Array(polys.length);
    for (let i=0; i<polys.length; i++) {
      PolyObj[i] = L.polygon(polys[i], {
        color: 'white',
        weight: 2,
        fillColor: d3.interpolateReds(sc(impact[i])),
        fillOpacity: opacity,
      })
      .bindTooltip(`${Names[i]}<br>${lower[i]} &mdash; <b>${impact[i]}</b> &mdash; ${upper[i]}`)
      .addTo(viz);
    }

    //Tile Map - borough names and order correspond for map and tiles
    d3.csv(`./london-maps/tile-vertices.csv`).then( tileData => {

      const sqWidth = 56;
      const gap = 3;
      const xShift = d => (d.x - 1)*(sqWidth + gap); 
      const yShift = d => (-d.y + 7)*(sqWidth + gap) + 5; 

      //tiles
      const svgTile = d3.select('#svg-tile');
      svgTile.selectAll("rect")
          .data(tileData)
        .enter().append('rect')
          .attr('x', xShift)
          .attr('y', yShift)
          .attr('width', sqWidth)
          .attr('height', sqWidth)
          .attr('id', d => d.Name.replace(/ /g, '_'))
          .style('stroke-width','3')
          .style('stroke','none')
          .style('opacity',opacity)
          .style('fill', (d,i) => d3.interpolateReds(sc(impact[i])))
          .on('mouseenter', d => {
            d3.select(`#${d.Name.replace(/ /g, '_')}`).style('stroke','black')
            d3.select(`#${d.Name.replace(/ /g, '_')}_range`).style('stroke','black')
          })
          .on('mouseleave', d => {
            d3.select(`#${d.Name.replace(/ /g, '_')}`).style('stroke','none')
            d3.select(`#${d.Name.replace(/ /g, '_')}_range`).style('stroke','none')
          });

      //boro names
      svgTile.selectAll("text")
          .data(tileData)
        .enter().append('text')
          .attr('x', d => xShift(d) + 4)
          .attr('y', d => yShift(d) + 4)
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("alignment-baseline", "hanging")
          .text(d => d.Name.slice(0,6));

      //impact value
      svgTile.selectAll("text .impact")
          .data(tileData)
        .enter().append('text')
          .attr('x', d => xShift(d) + 4)
          .attr('y', d => yShift(d) + 0.6*sqWidth)
          .attr("font-family", "sans-serif")
          .attr("font-size", "14px")
          .text((d,i) => impact[i]);

      //mean point
      svgTile.selectAll("circle")
          .data(tileData)
        .enter().append('circle')
          .attr('cx', (d,i) => xShift(d) + (impact[i] * sqWidth/100))
          .attr('cy', d => yShift(d) + 0.8*sqWidth)
          .attr("r", sqWidth/25)

      //range line on tiles
      svgTile.selectAll("line")
          .data(tileData)
        .enter().append('line')
          .attr('x1', (d,i) => xShift(d) + (lower[i] * sqWidth/100))
          .attr('x2', (d,i) => xShift(d) + (upper[i] * sqWidth/100))
          .attr('y1', d => yShift(d) + 0.8*sqWidth)
          .attr('y2', d => yShift(d) + 0.8*sqWidth)
          .attr("r", sqWidth/25)
          .attr("stroke", 'black');

      //ranges panel
      const svgRanges = d3.select('#svg-ranges');

      svgRanges.selectAll("rect")
          .data(tileData)
        .enter().append('rect')
          .attr('x', 0)
          .attr('y', (d,i) => (i+1) * 18 - 10)
          .attr('width', 200)
          .attr('height', 16)
          .attr('id', (d,i) => Names[sortedInds[i]].replace(/ /g, '_') + '_range')
          .style('stroke-width','3.5')
          .style('stroke','none')
          .style('opacity',opacity)
          .style('fill', (d,i) => d3.interpolateReds(sc(impact[sortedInds[i]])))
          .on('mouseenter', (d,i) => {
            d3.select(`#${Names[sortedInds[i]].replace(/ /g, '_')}` + '_range').style('stroke','black')
            d3.select(`#${Names[sortedInds[i]].replace(/ /g, '_')}`).style('stroke','black')
          })
          .on('mouseleave', (d,i) => {
            d3.select(`#${Names[sortedInds[i]].replace(/ /g, '_')}` + '_range').style('stroke','none')
            d3.select(`#${Names[sortedInds[i]].replace(/ /g, '_')}`).style('stroke','none')
          });

      //name and impact
      svgRanges.selectAll("text")
          .data(tileData)
        .enter().append('text')
          .attr('x', 80)
          .attr('y', (d,i) => (i+1) * 18)
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("alignment-baseline", "middle")
          .attr("text-anchor", "end")
          .text((d,i) => `${Names[sortedInds[i]].slice(0,6)} ${impact[sortedInds[i]]}`);

      //mean circle
      svgRanges.selectAll("circle")
          .data(tileData)
        .enter().append('circle')
          .attr('cx', (d,i) => 100 + (impact[sortedInds[i]] * sqWidth/100))
          .attr('cy', (d,i) => (i+1) * 18)
          .attr("r", sqWidth/25)

      //range lines
      svgRanges.selectAll("line")
          .data(tileData)
        .enter().append('line')
          .attr('x1', (d,i) => 100 + (lower[sortedInds[i]] * sqWidth/100))
          .attr('x2', (d,i) => 100 + (upper[sortedInds[i]] * sqWidth/100))
          .attr('y1', (d,i) => (i+1) * 18)
          .attr('y2', (d,i) => (i+1) * 18)
          .attr("r", sqWidth/25)
          .attr("stroke", 'black');
    });
  });
}
    
