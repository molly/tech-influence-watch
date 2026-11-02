import * as d3 from "d3";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import * as topojson from "topojson-client";
import { Objects, Topology } from "topojson-specification";

import {
  generateDomain,
  getFillClassNames,
} from "@/app/components/chloroplethConstants";
import styles from "@/app/components/chloroplethMap.module.css";

import Legend from "../Legend";
import Spinner from "./Spinner";

export default function USMapSkeleton({
  showLegend = true,
  showSpinner = false,
}: {
  showLegend?: boolean;
  showSpinner?: boolean;
}) {
  const us: Topology<
    Objects<GeoJsonProperties>
  > = require("@/app/data/counties-albers-10m.json");
  const collection: FeatureCollection<Geometry, GeoJsonProperties> =
    topojson.feature(us, us.objects.states) as FeatureCollection<
      Geometry,
      GeoJsonProperties
    >;
  const data = collection.features;
  const path = d3.geoPath();
  const domain = generateDomain(10000, 5000000);

  return (
    <div className={styles.mapWrapper}>
      <svg
        className={styles.svgSkeleton}
        viewBox="0 0 1000 620"
        strokeOpacity={0.2}
      >
        {showLegend && (
          <Legend fillClassNames={getFillClassNames(domain)} domain={domain} />
        )}
        <g>
          {data.map((d) => {
            return (
              <path
                id={d.id as string}
                key={`state-${d.id}`}
                d={path(d) as string}
              />
            );
          })}
        </g>
      </svg>
      {showSpinner && (
        <div className={styles.skeletonOverlay}>
          <Spinner />
        </div>
      )}
    </div>
  );
}
