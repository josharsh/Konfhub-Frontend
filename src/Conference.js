import React from "react";
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Badge} from "react-bootstrap";
import "./App.css";

const Conference = ({
  type,
  title,
  place,
  imageURL,
  startDate,
  endDate,
  website,
}) => {
  return (
    <Card className="box">
      
      <Card.Img variant="top" src={imageURL} width="400" height="250" />
      <Card.Body>
      <Card.Title style={{backgroundColor:"white", fontWeight:"bold"}}>{title}</Card.Title>
      <Badge className={ type}>{ type}</Badge>
      <Card.Text>{place}</Card.Text>
      <Button variant="outline-primary"><Card.Link style={{color:"inherit"}} href={website}>Website Link</Card.Link></Button>
      </Card.Body>
      <Card.Footer style={{backgroundColor:"white", fontWeight:"bold", fontFamily:"monospace"}}> <Card.Text>{startDate} - {endDate}</Card.Text></Card.Footer>
    </Card>
  );
};

export default Conference;
