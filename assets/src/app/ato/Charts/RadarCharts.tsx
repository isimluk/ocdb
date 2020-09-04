import * as React from 'react';
import { TextContent, Text } from '@patternfly/react-core';
import { CompletionChartProps, CompletionChartsProps, controlsBaseUrl, statusSort, sectionNames } from '@app/ato/Charts/common';
import { VictoryChart, VictoryBar, VictoryPolarAxis, VictoryStack, VictoryTheme, VictoryTooltip } from 'victory';
import { StatusColor } from '@app/ato/Products/DataList';
import { VictoryBarTTargetType } from 'victory-bar';
import { EventPropTypeInterface } from 'victory-core';

export const CompletionRadarCharts = React.memo((props: CompletionChartsProps) => {
    const { data } = props;
    return (
        <React.Fragment>
            { Object.keys(data).map((c) => { return (
                  <React.Fragment>
                      <TextContent>
                          <Text component="h2">{data[c].Certification}</Text>
                      </TextContent>
                      <CompletionRadarChart key={c} cs={data[c]} />
                  </React.Fragment>
            )}) }
        </React.Fragment>
    )
})

const CompletionRadarChart = React.memo((props: CompletionChartProps) => {
    const pf = props.cs.PerFamily;
    const statuses = statusSort(Object.keys(pf).map((family) => Object.keys(pf[family])).reduce((a, b) => a.concat(b)).filter((value, index, self) => {
        return self.indexOf(value) === index;
    }))
    const controlsPerFamily = Object.keys(pf).reduce((map, family) => {
        map[family] =Object.keys(pf[family]).map((status) => pf[family][status]).reduce((a, b) => a + b);
        return map;
    }, {})
    const data = statuses.map((status) => {
        return Object.keys(pf).map((family) => {
            var y = pf[family][status]
            y = y == undefined ? 0 : y
            return { x: family, y: y / controlsPerFamily[family], status: status, count: y }
        });
    })
    const baseUrl = controlsBaseUrl(props.cs.Certification)
    const eventHandlers: EventPropTypeInterface<VictoryBarTTargetType, string | number | string[] | number[]>[] = [{
        target: "data",
        eventHandlers: {
            onClick: () => {
                return [{
                    target: "data",
                    mutation: (props) => {
                        window.open(baseUrl + props.datum.status + "&section=" + props.datum.x);
                        return null
                    }
                }];
            }
        }
    }]

    return (
        <div style={{ height: '500px', width: '500px' }}>
            <VictoryChart polar
                          theme={VictoryTheme.material}
            >
                {
                    Object.keys(pf).map((d, i) => {
                        return (
                            <VictoryPolarAxis dependentAxis
                                              key={i}
                                              label={d}
                                              labelPlacement="perpendicular"
                                              style={{ tickLabels: { fill: "none" } }}
                                              axisValue={d}
                            />
                        );
                    })
                }

                <VictoryStack
                    colorScale={statuses.map((status) => StatusColor[status]) }
                    style={{ data: { width: 20} }}
                >
                    { data.map((statusData) => { return (<VictoryBar
                                                             labels={({ datum }) => `${datum.count} ${datum.status} responses for ${datum.x} (${sectionNames[datum.x]})`}

                                                             labelComponent={<VictoryTooltip/>}
                                                             events={eventHandlers}
                                                             key={statusData[0].x} data={statusData} />) } ) }
                </VictoryStack>
            </VictoryChart>
        </div>
    );
})
