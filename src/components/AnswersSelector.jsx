import React from "react";
import type from "prop-types";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import Divider from "material-ui/Divider";
import Humps from "humps";

const inlineStyles = {
  sectionLabel: {
    margin: "5px 0 0 20px",
    fontWeight: "bold",
    fontSize: 16
  }
};

const NO_ANSWER = { id: -3, name: "NO ANSWER" };
const ANY_ANSWER = { id: -2, name: "ANY ANSWER" };
const IGNORE_ANSWERS = { id: -1, name: "IGNORE ANSWERS" };

const ANSWER_META_FILTERS = {};
ANSWER_META_FILTERS[IGNORE_ANSWERS.id] = IGNORE_ANSWERS;
ANSWER_META_FILTERS[ANY_ANSWER.id] = ANY_ANSWER;
ANSWER_META_FILTERS[NO_ANSWER.id] = NO_ANSWER;

const makeMetafilter = (ignoreAnswers, anyAnswer, noAnswer, answerItem) => {
  const filter = {
    ignoreAnswers,
    anyAnswer,
    noAnswer,
    selectedAnswers: {},
    suppressedAnswers: {}
  };

  if (answerItem) {
    filter.selectedAnswers[answerItem.key] = answerItem;
  }

  return filter;
};

const IGNORE_ANSWERS_FILTER = makeMetafilter(
  true,
  false,
  false,
  IGNORE_ANSWERS
);
const ANY_ANSWER_FILTER = makeMetafilter(false, true, false, ANY_ANSWER);
const NO_ANSWER_FILTER = makeMetafilter(false, false, true, NO_ANSWER);
const EMPTY_ANSWER_FILTER = makeMetafilter(false, false, false, null);

export class AnswersSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answersFilter: this.cloneFilter() || EMPTY_ANSWER_FILTER
    };
  }

  cloneFilter = () => {
    const { answersFilter, answerOptions } = this.props;
    const selectedAnswers = {};
    if (Object.keys(answersFilter.selectedAnswers || {}).length > 0) {
      Object.keys(answersFilter.selectedAnswers).forEach(key => {
        if (key > 0) {
          selectedAnswers[key] = answerOptions[key] || ANSWER_META_FILTERS[key];
        }
      });
    }

    const suppressedAnswers = {};

    if (Object.keys(answersFilter.suppressedAnswers || {}).length > 0) {
      Object.keys(answersFilter.suppressedAnswers).forEach(key => {
        if (key > 0) {
          suppressedAnswers[key] = this.props[key] || ANSWER_META_FILTERS[key];
        }
      });
    }

    return {
      ignoreAnswers: answersFilter.ignoreAnswers,
      anyAnswer: answersFilter.anyAnswer,
      noAnswer: answersFilter.noAnswer,
      selectedAnswers,
      suppressedAnswers
    };
  };

  handleClick = itemClicked => {
    let { answersFilter } = this.state;
    switch (itemClicked.id) {
      case IGNORE_ANSWERS.id:
        answersFilter = IGNORE_ANSWERS_FILTER;
        break;
      case NO_ANSWER.id:
        answersFilter = NO_ANSWER_FILTER;
        break;
      case ANY_ANSWER.id:
        answersFilter = ANY_ANSWER_FILTER;
        break;
      default:
        if (
          answersFilter.ignoreAnswers ||
          answersFilter.anyAnswer ||
          answersFilter.noAnswer
        ) {
          answersFilter = makeMetafilter(false, false, false, null);
        }

        if (itemClicked.id in answersFilter.selectedAnswers) {
          delete answersFilter.selectedAnswers[itemClicked.id];
        } else if (itemClicked.id in answersFilter.suppressedAnswers) {
          delete answersFilter.suppressedAnswers[itemClicked.id];
        } else if (String(itemClicked.id).startsWith("s_")) {
          answersFilter.suppressedAnswers[itemClicked.id] = itemClicked;
          delete answersFilter.selectedAnswers[
            itemClicked.id.replace("s_", "")
          ];
        } else {
          answersFilter.selectedAnswers[itemClicked.id] = itemClicked;
          delete answersFilter.suppressedAnswers[`s_${itemClicked.id}`];
        }
    }

    this.setState({ answersFilter });
    this.props.onChange(answersFilter);
  };

  createMenuItem = (answersFilter, isChecked) => {
    return (
      <MenuItem
        key={answersFilter.id}
        value={answersFilter}
        primaryText={answersFilter.name}
        insetChildren
        checked={isChecked}
        onClick={() => this.handleClick(answersFilter)}
      />
    );
  };

  createMetaFilterMenuItems = metaFilters => {
    console.log(metaFilters, this.state.answersFilter);
    const menuItems = metaFilters.map(answersFilter => {
      const isChecked = !!(this.state.answersFilter || {})[
        Humps.camelize(answersFilter.name.toLowerCase())
      ];
      return this.createMenuItem(answersFilter, isChecked);
    });
    return menuItems;
  };

  createAnswerMenuItems = answersFilters => {
    return answersFilters
      .sort((left, right) => {
        if (left.name === right.name) {
          return 0;
        }

        return left.name < right.name ? 0 : 1;
      })
      .map(answersFilter => {
        const isChecked = [
          ...Object.keys(this.state.answersFilter.selectedAnswers || {}),
          ...Object.keys(this.state.answersFilter.suppressedAnswers || {})
        ].includes(answersFilter.id);

        return this.createMenuItem(answersFilter, isChecked);
      });
  };

  determineSelectFieldValue = () => {
    const answersFilter = this.state.answersFilter;
    if (answersFilter.noAnswer) {
      return [NO_ANSWER];
    }

    if (answersFilter.anyAnswer) {
      return [ANY_ANSWER];
    }

    if (answersFilter.ignoreAnswers) {
      return [IGNORE_ANSWERS];
    }

    return [
      ...Object.values(answersFilter.selectedAnswers || {}),
      ...Object.values(answersFilter.suppressedAnswers || {})
    ];
  };

  render() {
    return (
      <SelectField
        multiple
        value={this.determineSelectFieldValue()}
        hintText={this.props.hintText}
        floatingLabelText={"Question Answers"}
        floatingLabelFixed
        style={{ width: "100%" }}
        maxHeight={600}
      >
        {this.createMetaFilterMenuItems(Object.values(ANSWER_META_FILTERS))}

        <Divider inset />
        <div style={inlineStyles.sectionLabel}>FILTER BY ANSWERS</div>

        {this.createAnswerMenuItems(Object.values(this.props.answerOptions))}

        <Divider inset />
        <div style={inlineStyles.sectionLabel}>SUPPRESS ANSWERS</div>

        {this.createAnswerMenuItems(
          Object.values(this.props.answerOptions).map(answer => ({
            ...answer,
            id: `s_${answer.id}`
          }))
        )}
      </SelectField>
    );
  }
}

AnswersSelector.propTypes = {
  onChange: type.func.isRequired,
  answersFilter: type.object.isRequired,
  hintText: type.string,
  answerOptions: type.arrayOf(type.object)
};

export default AnswersSelector;
