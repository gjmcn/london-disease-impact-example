## London Disease Impact Example

See the example: [GITHUB PAGES]() (**use Chrome**). Run a local server if viewing the example locally.

The example is an unfinished demo. In particular:

* It uses toy data which is regenerated on each load &mdash; Ctrl-R to see different 'scenarios'.

* The range for the highest two boroughs is tweaked so the highest has a large range and the second highest has a small range.

* There are various missing features, e.g.

    * all 3 components should be linked and have tooltips (currently the map has a tooltip; the tiles and ranges are linked on hover)

	* there should be an axis above the list of ranges on the right

Other Notes:

* In cases where there are many regions (e.g. at post code level), we would not show all the info on the tiles nor all the ranges on the right. When zoom-in, could show detail on tiles and the ranges on the right.

* Other relevant info could be shown on the tiles &mdash; not just related to the model, but e.g. whether there is a hospital in the borough.

* Could consider multiple scenarios simultaneously or compare prediction for do nothing/intervention could show eg four linked maps, four linked tile maps or four linked ranges.

* Could animate or have time slider for temporal data

* The range diagrams could show multimodal data &mdash; there would be multiple dots and segments.
