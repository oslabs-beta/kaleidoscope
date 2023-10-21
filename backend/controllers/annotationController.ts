// CREATE TABLE annotation (annotationid int, primary key (annotationid), 
// title varchar(255), body varchar(255), nodemapid int, foreign key (nodemapid) references nodemap(nodemapid), date DATE)

// CREATE TABLE nodemap (nodemapid int, primary key (nodemapid), annotations int, nodenames varchar(255), 
// nodex int constraint nodex_range check ( nodex>=0 and nodex<=1200), 
// nodey int constraint nodey_range check ( nodey>=0 and nodey<=1200), 
// connecta varchar(255), connectb varchar (255), date DATE, label varchar(255))

import db from '../models/annotationModel';
import { Request, Response } from 'express'

































export const annotationController = {




}