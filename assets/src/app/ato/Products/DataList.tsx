import * as React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Button, ButtonVariant,
    DataList,
    DataListItem,
    DataListItemRow,
    DataListCell,
    DataListToggle,
    DataListContent,
    DataListItemCells,
    Dropdown, DropdownItem, DropdownPosition, DropdownSeparator, DropdownToggle,
    InputGroup,
    Label,
    Select, SelectOption, SelectVariant,
    Switch,
    TextInput,
} from '@patternfly/react-core';
import { SearchIcon, DownloadIcon } from '@patternfly/react-icons'
import {
    Toolbar, ToolbarContent, ToolbarFilter, ToolbarGroup, ToolbarItem,
} from '@patternfly/react-core';

import { Certification, CustomControl, OpenControlToCSV } from '@app/lib/opencontrol'
import { RTMDetail } from '@app/ato/Products/RTMDetail.tsx'
import { GetActiveProductIdFromUrl } from '@app/AppLayout/ProductSelector'
import * as Api from '@app/lib/api'
import { ServeCSV } from '@app/lib/csv'
import * as qs from '@app/lib/querystring'

interface RTMToolbarKebabProps {
    view: RTMDataList;
}

interface RTMToolbarKebabState {
    open: boolean;
    productId?: string;
}

class RTMToolbarKebab extends React.PureComponent<RTMToolbarKebabProps, RTMToolbarKebabState> {
    constructor(props) {
        super(props)
        this.state = {open: false, productId: GetActiveProductIdFromUrl()}
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(open) {
        this.setState({open})
    }

    downloadCsv(subset) {
        const state = this.props.view.state;
        const rows = subset ? state.data.filter((r, idx) => { return r.visible }) : state.data
        const controls = rows.map((r) => r.control)
        ServeCSV("controls.csv", OpenControlToCSV(controls))
    }

    render() {
        const downloadCsv = this.downloadCsv.bind(this);
        const dropdownItems = [
            <DropdownItem key="link1"><p onClick={() => {downloadCsv(true)}}>Download Filtered Subset (CSV)</p></DropdownItem>,
            <DropdownSeparator key="separator" />,
            <DropdownItem key="link2"><p onClick={() => {downloadCsv(false)}}>Download All Controls (CSV)</p></DropdownItem>,
            <DropdownItem key="link3" href={"https://raw.githubusercontent.com/ComplianceAsCode/oscal/master/xml/" + this.state.productId + "-fedramp-High.xml"}>Download All Controls (OSCAL)</DropdownItem>,
            <DropdownItem key="link4" href={"https://raw.githubusercontent.com/ComplianceAsCode/redhat/master/build/" + this.state.productId + "/component.yaml"}>Download All Controls (OpenControl YAML)</DropdownItem>,
        ];
        return <Dropdown
                   toggle={
                       <DropdownToggle onToggle={this.onToggle} aria-label="Downloads">
                           <DownloadIcon />
                       </DropdownToggle>
                   }
                   isOpen={this.state.open}
                   position={DropdownPosition.right}
                   isPlain
                   dropdownItems={dropdownItems}
        />
    }
}
interface RTMToolbarFilters {
    section: string[];
    status: string[];
    solution: string[];
    search: string[];
    standard: string[];
}

interface RTMToolbarState {
    sectionIsExpanded: boolean;
    statusIsExpanded: boolean;
    solutionIsExpanded: boolean;
    standardIsExpanded: boolean;
    filters: RTMToolbarFilters;
    expanded: boolean;
}
interface RTMToolbarProps {
    view: RTMDataList;
    rowCount: number;
    visibleRows: number;
}

class RTMToolbar extends React.Component<RTMToolbarProps, RTMToolbarState> {
    sectionOptions = [
        { value: 'AC', label: 'Access Control'},
        { value: 'AT', label: 'Awareness and Training'},
        { value: 'AU', label: 'Audit and Accountability'},
        { value: 'CA', label: 'Security Assessment & Authorization'},
        { value: 'CM', label: 'Configuration Management'},
        { value: 'CP', label: 'Contingency Planning'},
        { value: 'IA', label: 'Identification and Authentication'},
        { value: 'IR', label: 'Incident Response'},
        { value: 'MA', label: 'Maintenance'},
        { value: 'MP', label: 'Media Protection'},
        { value: 'PE', label: 'Physical & Environmental Protection'},
        { value: 'PL', label: 'Planning'},
        { value: 'PS', label: 'Personnel Security'},
        { value: 'RA', label: 'Risk Management'},
        { value: 'SA', label: 'System and Services Acquisition'},
        { value: 'SC', label: 'Systems and Communications Protection'},
        { value: 'SI', label: 'System and Information Integrity'},
    ];
    statusOptions = [
        { value: 'complete', label: 'Complete'},
        { value: 'partial', label: 'Partial'},
        { value: 'not applicable', label: 'Not Applicable'},
        { value: 'planned', label: 'Planned'},
        { value: 'unsatisfied', label: 'Unsatisfied'},
        { value: 'unknown', label: 'Unknown'},
        { value: 'none', label: 'None'},
    ];
    solutionOptions = [
        { value: 'Available' },
        { value: 'Not available' }
    ];
    standardOptions = [
        { value: 'Loading' }
    ]
    onExpandToggle(isChecked){
        this.setState({expanded: isChecked});
        this.props.view.onExpandToggle(isChecked);
    };

    constructor(props) {
        super(props);
        this.state = {
            sectionIsExpanded: false,
            statusIsExpanded: false,
            solutionIsExpanded: false,
            standardIsExpanded: false,
            filters: {section: [], status: [], solution: [], search: [], standard: []},
            expanded: false,
        };
        this.onSearchInputChange = this.onSearchInputChange.bind(this);
        this.onSectionToggle = this.onSectionToggle.bind(this);
        this.onSectionSelect = this.onSectionSelect.bind(this);
        this.onStatusToggle = this.onStatusToggle.bind(this);
        this.onStatusSelect = this.onStatusSelect.bind(this);
        this.onSolutionToggle = this.onSolutionToggle.bind(this);
        this.onSolutionSelect = this.onSolutionSelect.bind(this);
        this.onStandardToggle = this.onStandardToggle.bind(this);
        this.onStandardSelect = this.onStandardSelect.bind(this);
        this.onDelete = this.onDelete.bind(this);

        this.onExpandToggle = this.onExpandToggle.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this)

        RTMToolbar.rebuildFiltersBasedOnUrl(props, this.state.filters)

        Api.certifications().then((certs) => {
            this.standardOptions = certs.map((c: Certification) => {
                return {'value': c.Key}
            })
        })
    }

    static rebuildFiltersBasedOnUrl(props, filters) {
        const params = qs.Parse()
        var recompute = false;
        Object.keys(filters).forEach((key) => {
            if (params[key] != undefined) {
                filters[key] = Array.isArray(params[key]) ? params[key] : [params[key]]
                recompute = true
            }
        })
        if (recompute) {
            props.view.recomputeFilters(filters)
        }
    }

    componentDidMount() {
        const hash = window.location.hash.replace('%20', ' ');
        if (hash.length > 1) {
            location.hash = hash;
        }
    }

    onSelect(type, event, selection) {
        const checked = event.target.checked;
        const prevState = this.state;
        const prevSelections = prevState.filters[type];
        var filters = {
            ...prevState.filters,
            [type]: checked
            ? [...prevSelections, selection]
            : prevSelections.filter(value => value !== selection)
        };
        this.props.view.recomputeFilters(filters);
        this.setState({filters: filters});
    }

    onSectionToggle(isExpanded) {
        this.setState({
            sectionIsExpanded: isExpanded
        });
    };
    onSectionSelect(event, selection) {
        this.onSelect('section', event, selection);
    };

    onStatusToggle(isExpanded) {
        this.setState({
            statusIsExpanded: isExpanded
        });
    };
    onStatusSelect(event, selection) {
        this.onSelect('status', event, selection);
    };

    onSolutionToggle(isExpanded) {
        this.setState({
            solutionIsExpanded: isExpanded
        });
    };
    onSolutionSelect(event, selection) {
        this.onSelect('solution', event, selection);
    };
    onStandardToggle(isExpanded) {
        this.setState({
            standardIsExpanded: isExpanded
        });
    }
    onStandardSelect(event, selection) {
        this.setState((prevState, props) => {
            if (prevState.filters.standard.length == 1 && prevState.filters.standard[0] == selection) {
                prevState.filters.standard = []
            } else {
                prevState.filters.standard = [selection]
            }
            this.props.view.recomputeFilters(prevState.filters)
            return prevState
        })
        this.onStandardToggle(false)
    };

    onSearchInputChange(newValue) {
        var filters = this.state.filters;
        if (newValue.length == 0) {
            filters.search = []
        } else {
            filters.search = [newValue];
        }
        this.props.view.recomputeFilters(filters);
        this.setState({filters: filters});
    }

    onDelete(type="", id="") {
        if (type) {
            var filters = this.state.filters;
            filters[type.toLowerCase()] = filters[type.toLowerCase()].filter(s => s !== id);
            this.setState({filters: filters});
            this.props.view.recomputeFilters(filters);

        } else {
            const filters = {
                section: [],
                status: [],
                solution: [],
                search: [],
                standard: [],
            }
            this.props.view.recomputeFilters(filters);
            this.setState({filters: filters})
        }
    }

    render() {
        const { sectionIsExpanded, statusIsExpanded, solutionIsExpanded, standardIsExpanded, filters, expanded } = this.state;
        const searchGroupItems = <React.Fragment>
            <ToolbarItem variant="label" id="stacked-example-resource-select">Search</ToolbarItem>
            <ToolbarFilter chips={filters.search} deleteChip={this.onDelete} categoryName="Search">
                <InputGroup>
                    <TextInput name="textInput1" id="textInput1" type="search" aria-label="hypertext search NIST-800-53 controls" onChange={this.onSearchInputChange}/>
                    <Button variant={ButtonVariant.tertiary} aria-label="search button for search input">
                        <SearchIcon />
                    </Button>
                </InputGroup>
            </ToolbarFilter>
        </React.Fragment>

        const filterGroupItems = <React.Fragment>
            <ToolbarFilter chips={filters.section} deleteChip={this.onDelete} categoryName="Section">
                <Select
                    variant={SelectVariant.checkbox}
                    aria-label="Section"
                    onToggle={this.onSectionToggle}
                    onSelect={this.onSectionSelect}
                    selections={filters.section}
                    isOpen={sectionIsExpanded}
                    placeholderText="Section"
                >
                    {this.sectionOptions.map((option, index) => (
                        <SelectOption key={index} value={option.value}>
                            {option.value}: {option.label}
                        </SelectOption>
                    ))}
                </Select>
            </ToolbarFilter>
            <ToolbarFilter chips={filters.status} deleteChip={this.onDelete} categoryName="Status">
                <Select
                    variant={SelectVariant.checkbox}
                    aria-label="Status"
                    onToggle={this.onStatusToggle}
                    onSelect={this.onStatusSelect}
                    selections={filters.status}
                    isOpen={statusIsExpanded}
                    placeholderText="Status"
                >
                    {this.statusOptions.map((option, index) => (
                        <SelectOption key={index} value={option.value}>
                            {option.label}
                        </SelectOption>
                    ))}
                </Select>
            </ToolbarFilter>
            <ToolbarFilter chips={filters.solution} deleteChip={this.onDelete} categoryName="Solution">
                <Select
                    variant={SelectVariant.checkbox}
                    aria-label="Solution"
                    onToggle={this.onSolutionToggle}
                    onSelect={this.onSolutionSelect}
                    selections={filters.solution}
                    isOpen={solutionIsExpanded}
                    placeholderText="Solution"
                >
                    {this.solutionOptions.map((option, index) => (
                        <SelectOption
                            key={index}
                            value={option.value}
                        />
                    ))}
                </Select>
            </ToolbarFilter>
            <ToolbarFilter chips={filters.standard} deleteChip={this.onDelete} categoryName="Standard">
                <Select
                    variant={SelectVariant.checkbox}
                    typeAheadAriaLabel="Certification"
                    aria-label="Standard"
                    onToggle={this.onStandardToggle}
                    onSelect={this.onStandardSelect}
                    selections={filters.standard}
                    isOpen={standardIsExpanded}
                    placeholderText={filters.standard[0] || "Certification"}
                >
                    {this.standardOptions.map((option, index) => (
                        <SelectOption
                            key={index}
                            value={option.value}
                        />
                    ))}
                </Select>
            </ToolbarFilter>
        </React.Fragment>;

        const buttonGroupItems = <React.Fragment>
            <ToolbarItem>
                <strong>{this.props.visibleRows} </strong>
                { this.props.rowCount == this.props.visibleRows ?
                  "" :
                  <React.Fragment>
                      of <strong>{this.props.rowCount} </strong>
                  </React.Fragment>
                }
                Items
            </ToolbarItem>
            <ToolbarItem variant="separator"></ToolbarItem>
            <ToolbarItem>
                <Switch id="simple-switch" label="Collapse All" labelOff="Expand All" onChange={this.onExpandToggle} isChecked={expanded} />
            </ToolbarItem>
            <ToolbarItem>
                <RTMToolbarKebab view={this.props.view} />
            </ToolbarItem>
        </React.Fragment>;

        const toolbarItems = <React.Fragment>
            <ToolbarGroup >{searchGroupItems}</ToolbarGroup>
            <ToolbarGroup variant="filter-group">{filterGroupItems}</ToolbarGroup>
            <ToolbarGroup variant="button-group">{buttonGroupItems}</ToolbarGroup>
        </React.Fragment>;

        return <Toolbar
                   id="data-toolbar-with-chip-groups"
                   clearAllFilters={this.onDelete}>
                   <ToolbarContent>{toolbarItems}</ToolbarContent>
               </Toolbar>;
    }
}

export const StatusColor = {
    'unknown': '#e31c3d',
    'unsatisfied': '#e31c3d',
    'none': '#e31c3d',
    'not applicable': '#a9c1a9',
    'complete': '#2e8540',
    'partial': '#fdb81e',
    'planned': '#02bfe7',
};

const ImplementationStatus = React.memo((props:any) => {
    var style : React.CSSProperties = { 'backgroundColor': StatusColor[props['status']] };
    return (<Label style={style}>{props['status']}</Label>);
})

interface RTMDataListItemProps {
    content: CustomControl;
    forceExpand: boolean;
}

interface RTMDataListItemState {
    expanded: boolean;
}

class RTMDataListItem extends React.PureComponent<RTMDataListItemProps, RTMDataListItemState> {
    constructor(props) {
        super(props);
        this.state = {expanded: props.content.Key == window.location.hash.replace('%20', ' ').replace('#','')};
    }
    toggle() {
        this.setState({expanded: !this.state.expanded})
    }

    static getDerivedStateFromProps(props, state) {
        const hash = window.location.hash.replace('%20', ' ');
        if (props.content.Key == hash.replace('#','')) {
            location.hash = hash;
            return {expanded: true}
        }
        return null;
    }

    render() {
        const c = this.props.content;
        const expanded = this.props.forceExpand || this.state.expanded;
        const implementation_status = c.Satisfies ? c.Satisfies.implementation_status : "unknown";

        return (
            <DataListItem aria-labelledby="ex-item1" isExpanded={expanded} id={c.Key}>
            <DataListItemRow>
            <DataListToggle
            onClick={() => this.toggle()}
            isExpanded={expanded}
                        id="ex-toggle1"
                        aria-controls="ex-expand1"
                    />
                    <DataListItemCells
                        dataListCells={[
                            <DataListCell isIcon key="icon">
                            </DataListCell>,
                            <DataListCell key="primary content">
                                <NavLink to={"#" + c.Key} onClick={() => this.toggle() }>{c.Key}</NavLink>
                            </DataListCell>,
                            <DataListCell key="secondary content">
                                {c.Control.name}
                            </DataListCell>,
                            <DataListCell key="secondary content 2">
                                <ImplementationStatus status={implementation_status} />
                            </DataListCell>
                        ]}
                    />
               </DataListItemRow>
               { expanded ?
                 <DataListContent
                     aria-label="Primary Content Details"
                     isHidden={!expanded}
                     >
                     <RTMDetail control={c}/>
                 </DataListContent>
                 : ''
               }
            </DataListItem>
        )
    }
}

interface ControlWrapper {
    control: CustomControl;
    visible: boolean;
    fulltext: string;
}
export interface RTMProps {
    content: CustomControl[];
    certifications: Certification[];
}

export interface RTMState {
    data: ControlWrapper[];
    visibleRows: number;
    expandAll: boolean;
}

class RTMDataList extends React.Component<RTMProps, RTMState> {
    constructor(props) {
        super(props);
        this.state = {
            expandAll: false,
            visibleRows: props.content.length,
            data: props.content.map(function(c, idx) {
                c.expanded = false;
                return {
                    control: c,
                    visible: true,
                    fulltext: JSON.stringify(c).toUpperCase()
                };
            })
        }
    }

    static rowMatchesFilters(control: CustomControl, fulltext: string, filters: RTMToolbarFilters, certifications: Certification[]) {
        if (filters.standard.length != 0) {
            var certification = certifications.find((c) => c.Key == filters.standard[0])
            if (certification == undefined || certification.Controls[control.Key] != true) {
                return false
            }
        }
        if (filters.section.length != 0) {
            if (filters.section.some((function(selection) {
                return control.Key.startsWith(selection);
            })) == false) {
                return false;
            }
        }

        if (filters.status.length != 0) {
            if (filters.status.some((function(selection) {
                return (selection == 'unknown' && control.Satisfies == null) || (control.Satisfies != null && control.Satisfies.implementation_status == selection);
            })) == false) {
                return false;
            }
        }

        if (filters.solution.length != 0) {
            if (filters.solution.some((function(selection) {
                if (selection == 'Available') {
                    return (control.Satisfies != undefined && control.Satisfies.narrative && control.Satisfies.narrative.length > 0 && control.Satisfies.narrative[0].text != '');
                } else {
                    return control.Satisfies == undefined || !(control.Satisfies.narrative) || control.Satisfies.narrative.length == 0 || (control.Satisfies.narrative.length == 1 && control.Satisfies.narrative[0].text == '');
                }
            })) == false) {
                return false;
            }
        }
        if (filters.search.length != 0) {
            if (filters.search.some((function(selection) {
                return fulltext.includes(selection.toUpperCase());
            })) == false) {
                return false;
            }
        }

        return true;
    }


    onExpandToggle(isChecked) {
        this.setState({expandAll: isChecked});
    }

    recomputeFilters(filters) {
        this.setState((prevState, prosp) => {
            var visibleRows = 0;
            var certifications = this.props.certifications;
            var data = prevState.data.map(function(c, idx) {
                c.visible = RTMDataList.rowMatchesFilters(c.control, c.fulltext, filters, certifications);
                if (c.visible) {
                    visibleRows++;
                }
                return c;
            })
            return {data: data, visibleRows: visibleRows}
        });
        qs.Set(filters)
    };

    render () {
        const expandAll = this.state.expandAll;
        return (
            <React.Fragment>
                <RTMToolbar view={this} rowCount={this.state.data.length} visibleRows={this.state.visibleRows} />

                <DataList aria-label="Expandable data list example">
                    { this.state.data.map(function(c, idx) {
                          return (
                              <div key={idx} style={c.visible ? {} : {display:'none'}}>
                                  {c.visible}
                                  <RTMDataListItem content={c.control} forceExpand={expandAll && c.visible} />
                              </div>
                          )
                    })}
                </DataList>
            </React.Fragment>
        )
    }
}


export { RTMDataList };
