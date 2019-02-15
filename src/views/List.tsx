import { CategorySearch, ReactiveBase, ResultCard } from "@appbaseio/reactivesearch";
import React, { Component } from "react";

export default class List extends Component {
  public render() {
    return (
      <ReactiveBase
        app="ori_cappelleadijssel_20190122164336"
        url="http://localhost:8080/search"
      >
        <CategorySearch
          componentId="searchbox"
          dataField="model"
          categoryField="brand.keyword"
          placeholder="Search for cars"
        />
        <ResultCard
          componentId="result"
          // title="Results"
          dataField="model"
          // from={0}
          target="fdsa"
          size={5}
          pagination={true}
          react={{
            and: ["searchbox", "ratingsfilter"],
          }}
          // onData={(res) => ({
          //   description: res.brand + " " + "★".repeat(res.rating),
          //   image: "https://bit.do/demoimg",
          //   title: res.model,
          // })}
        />
      </ReactiveBase>
    );
  }
}
