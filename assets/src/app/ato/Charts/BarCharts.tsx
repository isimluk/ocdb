import * as React from 'react';
import { TextContent, Text } from '@patternfly/react-core';
import { Chart, ChartAxis, ChartBar, ChartStack, ChartVoronoiContainer } from '@patternfly/react-charts';
import { CompletionChartProps, CompletionChartsProps, controlsBaseUrl, customTheme, statusSort, sectionNames } from '@app/ato/Charts/common';
import { StatusColor } from '@app/ato/Products/DataList';
import { VictoryBarTTargetType } from 'victory-bar';
import { EventPropTypeInterface } from 'victory-core';

export const CompletionBarCharts = React.memo((props: CompletionChartsProps) => {
    const { data } = props;
    return (
        <React.Fragment>
            { Object.keys(data).map((c) => { return (
                  <React.Fragment>
                      <TextContent>
                          <Text component="h2">{data[c].Certification}</Text>
                      </TextContent>
                      <CompletionBarChart key={c} cs={data[c]} />
                  </React.Fragment>
            )}) }
        </React.Fragment>
    )
})

const CompletionBarChart = React.memo((props: CompletionChartProps) => {
    const pf = props.cs.PerFamily;
    const statuses = statusSort(Object.keys(pf).map((family) => Object.keys(pf[family])).reduce((a, b) => a.concat(b)).filter((value, index, self) => {
        return self.indexOf(value) === index;
    }))
    const data = statuses.map((status) => {
        return Object.keys(pf).map((family) => {
            var y = pf[family][status]
            y = y == undefined ? 0 : y
            return { x: family, y: y, status: status}
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
    <div style={{ height: '275px', width: '700px' }}>
        <Chart
            ariaDesc="Control responses by section"
            ariaTitle="Control responses by section"
            containerComponent={<ChartVoronoiContainer labels={({ datum }) => `${datum.y} ${datum.status} responses for ${datum.x} (${sectionNames[datum.x]})`} constrainToVisibleArea />}
            legendData={statuses.map((status) => { return { name: status }})}
            legendOrientation="vertical"
            legendPosition="right"
            height={275}
            theme={customTheme(statuses, 'stack')}
            padding={{
                bottom: 50, // Adjusted to accommodate legend
                left: 50,
                right: 140,
                top: 10
            }}
            width={700}
        >
            <ChartAxis />
            <ChartAxis dependentAxis showGrid />
            <ChartStack colorScale={statuses.map((status) => StatusColor[status])}>
                { data.map((statusData) => { return (<ChartBar
                                                         events={eventHandlers}
                                                         key={statusData[0].x}
                                                         data={statusData} />) } ) }
            </ChartStack>
        </Chart>
    </div>
)
})


