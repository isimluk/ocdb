import * as React from 'react';
import { TextContent, Text } from '@patternfly/react-core';
import { ChartVoronoiContainer, ChartAreaProps } from '@patternfly/react-charts';
import { CompletionChartProps, CompletionChartsProps, controlsBaseUrl, customTheme } from '@app/ato/Charts/common'
import { Chart, ChartArea, ChartAxis, ChartStack } from '@patternfly/react-charts';
import { VictoryAreaTTargetType } from 'victory-area';
import { EventPropTypeInterface } from 'victory-core';

export const CompletionStackCharts = React.memo((props: CompletionChartsProps) => {
    const { data } = props;
    return (
        <React.Fragment>
            { Object.keys(data).map((c) => { return (
                  <React.Fragment>
                      <TextContent>
                          <Text component="h2">{data[c].Certification}</Text>
                      </TextContent>
                      <CompletionStackChart key={c} cs={data[c]} />
                  </React.Fragment>
            )}) }
        </React.Fragment>
    )
})

const CompletionStackChart = React.memo((props: CompletionChartProps) => {
    const statuses = props.cs.History.map((s) => Object.keys(s.Stats)).reduce((a, b) => a.concat(b)).filter((value, index, self) => {
        return self.indexOf(value) === index;
    })

    const result = statuses.map((status) => {
        return props.cs.History.map((snapshot, k) => {
            const y = snapshot.Stats[status]
            return { 'name': status, 'x': new Date(snapshot.Time), 'y': y == undefined ? 0 : y }
        })
    })

    const legendData = statuses.map((status) => {
        return { name: status }
    })
    const maxDomain = Object.values(props.cs.History[0].Stats).reduce((a, b) => { return (a as number) + (b as number) }) as number
    const baseUrl = controlsBaseUrl(props.cs.Certification)
    const eventHandlers: EventPropTypeInterface<VictoryAreaTTargetType, string | number>[] = [{
        target: "data",
        eventHandlers: {
            onClick: () => {
                return [{
                    target: "data",
                    mutation: (props) => {
                        window.open(baseUrl + props.data[0].name);
                        return null
                    }
                }];
            }
        }
    }]

    return (
        <div style={{ height: '465px', width: '750px' }}>
            <Chart
                ariaDesc="Control responses over time"
                ariaTitle="Control responses over time"
                legendData={legendData}
                legendOrientation="vertical"
                legendPosition="right"
                height={300}
                padding={{
                    bottom: 75, // Adjusted to accomodate legend
                    left: 50,
                    right: 150,
                    top: 20,
                }}
                maxDomain={{y: maxDomain}}
                theme={customTheme(statuses, 'stack')}
                scale={{x: 'time'}}
                containerComponent={<ChartVoronoiContainer labels={({ datum }) => `${datum.name}: ${datum.y}`} constrainToVisibleArea />}
            >
                <ChartAxis />
                <ChartAxis dependentAxis showGrid />
                <ChartStack>
                    { result.map((statusArea) => {
                        return (<ChartArea key={statusArea[0].name} data={statusArea} interpolation="monotoneX" events={eventHandlers} />)
                    }) }
                </ChartStack>
            </Chart>
        </div>
    );
})
