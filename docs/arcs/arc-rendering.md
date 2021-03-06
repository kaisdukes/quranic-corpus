# The Geometry of Arc Rendering in the Quranic Corpus

[Dr. Kais Dukes](https://github.com/kaisdukes)

### Background

This document derives the equation `rx = boxWidth / (1 + cos(theta))` found in the arc rendering code of the Quranic Arabic Corpus.

As we are dealing with graphics code, we choose coordinates so that the y-axis points downwards.

## Proof that rx = boxWidth / (1 + cos(theta)) where sin(theta) = deltaY / ry

### Problem

Compute the ellipse radius `rx` given an arc that touches a bounding box and connects two nodes on the box with constraints.

We assume a standard non-rotated ellipse with x-radius `rx` and y-radius `ry`, centered at `(h, k)`

The diagram below shows the elliptical arc and it's bounding box.

![](https://github.com/kaisdukes/quranic-corpus/blob/main/docs/arcs/arc-diagram.svg)

*Nota bene: `theta` here isn't strictly an angle; it's an angular parameter. But if our ellipse becomes a circle, `theta` can be seen as a standard angle.*

### Constraints

* (C1) Arc start node: a known point `(x1, y1)` that lies somewhere on the ellipse.
* (C2) Arc end node: a known point `(x2, y2)` that lies on the ellipse at its rightmost extent. This implies `k = y2` and `h = x2 - rx`.
* (C3) The y-radius `ry` is known.

An ellipse has 5 degrees of freedom: two for the position of the center, two for the radii, and one for the orientation. Given these constraints and the non-rotated orientation, the ellipse is uniquely defined and solvable.

### Auxiliary variables

* Let `boxWidth` be the width of the bounding box `abs(x2 - x1)`
* Let `deltaY` be the difference in height between the two nodes `abs(y2 - y1)`
* The bounding box has `boxHeight = ry` by design

### Proof

Given the coordinate system and that the lower left quadrant is of interest, we introduce an angular parameter `phi` which sweeps anti-clockwise from the negative x-axis.

In this choice of coordinates, the polar ellipse equation becomes: `x = h - rx * cos(phi)` and `y = k + ry * sin(phi)`

We know that `k = y2` and `h = x2 - rx`. Substituting gives us the equation for our ellipse: `x = x2 - rx * (1 + cos(phi))` and `y = y2 + ry * sin(phi)`

Let `theta` be the angular parameter for the start node. Then: `x1 = x2 - rx * (1 + cos(theta))` and `y1 = y2 + ry * sin(theta)`

Rearranging: `rx = boxWidth / (1 + cos(theta))` and `ry = deltaY / sin(theta)`

QED

### Geometric interpretation of theta

The choice of `phi` helps visualizing the arcs in the treebank. Think of `theta` as an angular parameter that rotates anti-clockwise from the negative x-axis to the line joining the start node and the ellipse's center. When nodes align horizontally, `theta = 0`.