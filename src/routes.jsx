import { IndexRoute, IndexRedirect, Route } from "react-router";
import App from "./components/App";
import AdminDashboard from "./components/AdminDashboard";
import AdminCampaignList from "./containers/AdminCampaignList";
import AdminCampaignStats from "./containers/AdminCampaignStats";
import AdminPersonList from "./containers/AdminPersonList";
import AdminIncomingMessageList from "./containers/AdminIncomingMessageList";
import AdminCampaignEdit from "./containers/AdminCampaignEdit";
import AdminReplySender from "./containers/AdminReplySender";
import AdminCampaignMessagingService from "./containers/AdminCampaignMessagingService";
import AdminBulkScriptEditor from "./containers/AdminBulkScriptEditor";
import TexterDashboard from "./components/TexterDashboard";
import TopNav from "./components/TopNav";
import DashboardLoader from "./containers/DashboardLoader";
import TexterTodoList from "./containers/TexterTodoList";
import TexterTodo from "./containers/TexterTodo";
import Login from "./components/Login";
import Terms from "./containers/Terms";
import Downtime from "./components/Downtime";
import React from "react";
import CreateOrganization from "./containers/CreateOrganization";
import CreateAdditionalOrganization from "./containers/CreateAdditionalOrganization";
import AdminOrganizationsDashboard from "./containers/AdminOrganizationsDashboard";
import JoinTeam from "./containers/JoinTeam";
import Home from "./containers/Home";
import Settings from "./containers/Settings";
import Tags from "./containers/Tags";
import UserEdit from "./containers/UserEdit";
import TexterFaqs from "./components/TexterFrequentlyAskedQuestions";
import FAQs from "./lib/faqs";
import {
  DemoTexterNeedsMessage,
  DemoTexterNeedsResponse,
  DemoTexter2ndQuestion,
  DemoTexterDynAssign,
  tests
} from "./components/AssignmentTexter/Demo";
import AssignmentSummary from "./components/AssignmentSummary";
import AdminPhoneNumberInventory from "./containers/AdminPhoneNumberInventory";

const checkDowntime = (nextState, replace) => {
  if (global.DOWNTIME && nextState.location.pathname !== "/downtime") {
    replace({
      pathname: "/downtime"
    });
  }
};

const checkTexterDowntime = requireAuth => (nextState, replace) => {
  if (global.DOWNTIME_TEXTER && nextState.location.pathname !== "/downtime") {
    replace({
      pathname: "/downtime"
    });
  } else {
    return requireAuth(nextState, replace);
  }
};

export default function makeRoutes(requireAuth = () => {}) {
  return (
    <Route path="/" component={App} onEnter={checkDowntime}>
      <IndexRoute component={Home} />
      <Route path="downtime" component={Downtime} />
      <Route path="admin" component={AdminDashboard} onEnter={requireAuth}>
        <IndexRoute component={() => <DashboardLoader path="/admin" />} />
        <Route path=":organizationId">
          <IndexRedirect to="campaigns" />
          <Route path="campaigns">
            <IndexRoute component={AdminCampaignList} />
            <Route path=":campaignId">
              <IndexRoute component={AdminCampaignStats} />
              <Route path="edit" component={AdminCampaignEdit} />
              <Route path="send-replies" component={AdminReplySender} />
              <Route
                path="messaging-service"
                component={AdminCampaignMessagingService}
              />
            </Route>
          </Route>
          <Route path="people" component={AdminPersonList} />
          <Route path="incoming" component={AdminIncomingMessageList} />
          <Route path="bulk-script-editor" component={AdminBulkScriptEditor} />
          <Route path="tags" component={Tags} />
          <Route path="settings" component={Settings} />
          <Route path="phone-numbers" component={AdminPhoneNumberInventory} />
        </Route>
      </Route>
      <Route
        path="app"
        component={TexterDashboard}
        onEnter={checkTexterDowntime(requireAuth)}
      >
        <IndexRoute
          components={{
            main: () => <DashboardLoader path="/app" />,
            topNav: p => (
              <TopNav title="Spoke Texting" orgId={p.params.organizationId} />
            )
          }}
        />
        <Route path=":organizationId">
          <IndexRedirect to="todos" />
          <Route
            path="faqs"
            components={{
              main: () => <TexterFaqs faqs={FAQs} />,
              topNav: p => (
                <TopNav title="Account" orgId={p.params.organizationId} />
              )
            }}
          />
          <Route
            path="account/:userId"
            components={{
              main: p => (
                <UserEdit
                  userId={p.params.userId}
                  organizationId={p.params.organizationId}
                />
              ),
              topNav: p => (
                <TopNav title="Account" orgId={p.params.organizationId} />
              )
            }}
          />
          <Route path="todos">
            <IndexRoute
              components={{
                main: TexterTodoList,
                topNav: p => (
                  <TopNav
                    title="Spoke Texting"
                    orgId={p.params.organizationId}
                  />
                )
              }}
            />
            <Route
              path="other/:userId"
              components={{
                main: TexterTodoList,
                topNav: p => (
                  <TopNav
                    title="Spoke Texting"
                    orgId={p.params.organizationId}
                  />
                )
              }}
            />
            <Route
              path="review/:reviewContactId"
              components={{
                fullScreen: props => <TexterTodo {...props} />,
                topNav: null
              }}
            />
            <Route path=":assignmentId">
              <Route
                path="text"
                components={{
                  fullScreen: props => (
                    <TexterTodo {...props} messageStatus="needsMessage" />
                  )
                }}
              />
              <Route
                path="reply"
                components={{
                  fullScreen: props => (
                    <TexterTodo {...props} messageStatus="needsResponse" />
                  ),
                  topNav: null
                }}
              />
              <Route
                path="stale"
                components={{
                  fullScreen: props => (
                    <TexterTodo {...props} messageStatus="convo" />
                  ),
                  topNav: null
                }}
              />
              <Route
                path="skipped"
                components={{
                  fullScreen: props => (
                    <TexterTodo {...props} messageStatus="closed" />
                  ),
                  topNav: null
                }}
              />
              <Route
                path="allreplies"
                components={{
                  fullScreen: props => (
                    <TexterTodo {...props} messageStatus="allReplies" />
                  ),
                  topNav: null
                }}
              />
              <Route
                path="all"
                components={{
                  fullScreen: props => (
                    <TexterTodo
                      {...props}
                      messageStatus="needsMessageOrResponse"
                    />
                  ),
                  topNav: null
                }}
              />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="login" component={Login} />
      <Route path="organizations" component={AdminOrganizationsDashboard} />
      <Route path="terms" component={Terms} />
      <Route path="reset/:resetHash" component={Home} onEnter={requireAuth} />
      <Route
        path="invite/:inviteId"
        component={CreateOrganization}
        onEnter={requireAuth}
      />
      <Route
        path="addOrganization/:inviteId"
        component={CreateAdditionalOrganization}
        onEnter={requireAuth}
      />
      <Route
        path=":organizationUuid/join/:campaignId"
        component={JoinTeam}
        onEnter={requireAuth}
      />
      <Route
        path=":organizationUuid/join"
        component={JoinTeam}
        onEnter={requireAuth}
      />
      <Route path="demo" component={TexterDashboard}>
        <Route
          path="text"
          components={{
            main: props => <DemoTexterNeedsMessage {...props} />,
            topNav: null
          }}
        />
        <Route
          path="reply"
          components={{
            main: props => <DemoTexterNeedsResponse {...props} />,
            topNav: null
          }}
        />
        <Route
          path="reply2"
          components={{
            main: props => <DemoTexter2ndQuestion {...props} />,
            topNav: null
          }}
        />
        <Route
          path="dyn"
          components={{
            main: props => <DemoTexterDynAssign {...props} />,
            topNav: null
          }}
        />
        <Route
          path="todos"
          components={{
            main: props => <AssignmentSummary {...tests("todos1")} />,
            topNav: p => <TopNav title="Spoke Texting Demo" orgId={"fake"} />
          }}
        />
        <Route
          path="todos2"
          components={{
            main: props => <AssignmentSummary {...tests("todos2")} />,
            topNav: p => <TopNav title="Spoke Texting Demo2" orgId={"fake"} />
          }}
        />
      </Route>
    </Route>
  );
}
