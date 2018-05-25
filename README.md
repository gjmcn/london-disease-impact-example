## London Disease Impact Example

See the [example](https://gjmcn.github.io/london-disease-impact-example/) &mdash; **use Chrome**.

The example is an unfinished demo:

* It uses toy data which is generated each time the example is loaded &mdash; Ctrl-R to see different 'scenarios'.

* The range for the two boroughs with the highest median impact is always tweaked: the highest is given a large range, the second highest a small range.

* There are various missing features, e.g.

    * all three components of the visualization should be linked and have tooltips (currently the map has tooltips; the tiles and ranges are linked on hover)

	* there should be an axis above the list of ranges on the right

Other Notes:

* In cases where there are many regions (e.g. at postcode level), we would not show all the info on the tiles nor all the ranges on the right. When zoom-in, could show the tile details and the ranges for the visible regions.

* Other relevant info could be shown on the tiles &mdash; not just related to the model, but e.g. if there is a hospital in the borough.

* Could consider multiple scenarios simultaneously or compare prediction for do nothing/intervention by showing e.g. multiple linked maps or multiple linked tile maps or multiple linked ranges (i.e. only use one component of the visualization).

* Could animate or have time slider for temporal data.

* The range diagrams could show multimodal data &mdash; there would be multiple dots and segments.

---

#### Produced by

1. Thomas Finnie
2. Dan Silk
3. Nick Holliman
4. Graham McNeill
5. Noel Nelson
6. Sam Grainger
7. Timos Kipouros
8. Duncan Lee
9. Sacha Darwin
