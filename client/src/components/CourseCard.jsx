import React from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const CourseCard = (props) => {
  return (
    <Card className="grid grid-flow-col hover:drop-shadow-lg w-auto h-full m-5 content-center ">
      {props.previewImage && (
        <img
          src={`http://localhost:4000/uploads/${props.previewImage}`}
          alt={`${props.title} preview`}
          className="w-44 h-full object-cover rounded mx-6"
        />
      )}
      <div className="mx-10 content-end">
        <CardTitle className="grid-col-2 font-title">{props.title}</CardTitle>
        <CardDescription className="my-2">{props.category}</CardDescription>
        <CardDescription className="my-2">
          {props.teacherName} {props.teacherLName}
        </CardDescription>
        <CardDescription className="my-2">$ {props.price}</CardDescription>
        <CardDescription className="my-2">
          {new Date(props.createdAt).toLocaleDateString()}
        </CardDescription>
        <Button className="my-2 w-full">Отримати курс</Button>
      </div>
    </Card>
  );
};

export default CourseCard;
