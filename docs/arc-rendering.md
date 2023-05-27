# The Geometry of Arc Rendering in the Quranic Corpus

## Background

This document derives the equation rx = boxWidth / (1 + cos(theta)) found in the arc rendering code of the Quranic Arabic Corpus.

As we are dealing with graphics code, the choose coordinates so that the Y-axis points downwards.

## Proof that rx = boxWidth / (1 + cos(theta)) where sin(theta) = deltaY / ry

## Problem

Compute the ellipse radius rx given an arc that touches a bounding box and connects two nodes on the box with constraints.

We have a standard non-rotated ellipse with x-radius rx and y-radius ry centerd at (h, k)

## Constraints

* (C1) Start node of arc: A known point (x1, y1) lies somewhere on the ellipse
* (C2) End node of arc: A known point (x2, y2) lies exactly on the ellipse at it's rightmost point. Therefore k = y2 and h = x2 - rx.
* (C3) The y-radius ry is known.

Note that an ellipse has 5 degrees of freedom: two for the position of the center, two for the radii, and one for the orientation.
Given these constraints and the non-rotated orientation, the ellipse is uniquely defined and solvable.

## Auxiliary variables

Let boxWidth be the width of the bounding box abs(x2 - x1)
Let deltaY be the difference in height between the two nodes abs(y2 - y1)
Note that the bounding box has boxHeight = ry by definition.

## Proof

Given the coordinate system and the quadrants of interest, let phi sweep an anti-clockwise angle from the negative X-axis.

In these choice of coordinates, the polar ellipse equation becomes:

x = h - rx * cos(phi)
y = k + ry * sin(phi)

We know that k = y2 and h = x2 - rx

Substituting, gives us the equation for our ellipse:

x = x2 - rx * (1 + cos(phi))
y = y2 + ry * sin(phi)

Let theta be the angle for the start node. Then:

x1 = x2 - rx * (1 + cos(theta))
y1 = y2 + ry * sin(theta)

Rearranging:

rx = boxWidth / (1 + cos(theta))
ry = deltaY / sin(theta)

QED

## Geometric interpretation of theta

The choice of phi helps visualizing the arcs in the treebank. When the two nodes are horizontal, then theta = 0. In general theta measures the anticlockwise angle from the negative x-axis to the line formed from the start node to the center of the ellipse.