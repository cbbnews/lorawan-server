%
% Copyright (c) 2016-2017 Petr Gotthard <petr.gotthard@centrum.cz>
% All rights reserved.
% Distributed under the terms of the MIT License. See the LICENSE file.
%
-module(lorawan_admin_database).

-export([init/2]).
-export([is_authorized/2]).
-export([allowed_methods/2]).
-export([content_types_provided/2]).
-export([content_types_accepted/2]).
-export([resource_exists/2]).
-export([delete_resource/2]).

-export([handle_get/2, handle_write/2]).

-include_lib("lorawan_server_api/include/lorawan_application.hrl").
-include("lorawan.hrl").

-record(state, {table, record, fields, key, module}).

init(Req, [Table, Record, Fields]) ->
    init0(Req, Table, Record, Fields, lorawan_admin);
init(Req, [Table, Record, Fields, Module]) ->
    init0(Req, Table, Record, Fields, Module).

init0(Req, Table, Record, Fields, Module) ->
    {_, Key} = lorawan_admin:parse({hd(Fields), cowboy_req:binding(hd(Fields), Req)}),
    {cowboy_rest, Req, #state{table=Table, record=Record, fields=Fields, key=Key, module=Module}}.

is_authorized(Req, State) ->
    lorawan_admin:handle_authorization(Req, State).

allowed_methods(Req, #state{key=undefined}=State) ->
    {[<<"OPTIONS">>, <<"GET">>, <<"POST">>], Req, State};
allowed_methods(Req, State) ->
    {[<<"OPTIONS">>, <<"GET">>, <<"PUT">>, <<"DELETE">>], Req, State}.

content_types_provided(Req, State) ->
    {[
        {{<<"application">>, <<"json">>, []}, handle_get}
    ], Req, State}.

handle_get(Req, #state{key=undefined}=State) ->
    paginate(Req, State,
        sort(Req, read_records(Req, State)));
handle_get(Req, #state{table=Table, key=Key}=State) ->
    [Rec] = mnesia:dirty_read(Table, Key),
    {jsx:encode(build_record(Rec, State)), Req, State}.

paginate(Req, State, List) ->
    case cowboy_req:match_qs([{'_page', [], <<"1">>}, {'_perPage', [], undefined}], Req) of
        #{'_perPage' := undefined} ->
            {jsx:encode(List), Req, State};
        #{'_page' := Page0, '_perPage' := PerPage0} ->
            {Page, PerPage} = {binary_to_integer(Page0), binary_to_integer(PerPage0)},
            Req2 = cowboy_req:set_resp_header(<<"X-Total-Count">>, integer_to_binary(length(List)), Req),
            {jsx:encode(lists:sublist(List, 1+(Page-1)*PerPage, PerPage)), Req2, State}
    end.

sort(Req, List) ->
    case cowboy_req:match_qs([{'_sortDir', [], <<"ASC">>}, {'_sortField', [], undefined}], Req) of
        #{'_sortField' := undefined} ->
            List;
        #{'_sortDir' := <<"ASC">>, '_sortField' := Field} ->
            Field2 = binary_to_existing_atom(Field, latin1),
            lists:sort(
                fun(A,B) ->
                    proplists:get_value(Field2, A) =< proplists:get_value(Field2, B)
                end, List);
        #{'_sortDir' := <<"DESC">>, '_sortField' := Field} ->
            Field2 = binary_to_existing_atom(Field, latin1),
            lists:sort(
                fun(A,B) ->
                    proplists:get_value(Field2, A) >= proplists:get_value(Field2, B)
                end, List)
    end.

read_records(Req, #state{table=Table, record=Record, fields=Fields, module=Module}=State) ->
    Filter = apply(Module, parse, [get_filters(Req)]),
    Match = list_to_tuple([Record|[proplists:get_value(X, Filter, '_') || X <- Fields]]),
    lists:map(
        fun(Rec)-> build_record(Rec, State) end,
        mnesia:dirty_select(Table, [{Match, [], ['$_']}])).

get_filters(Req) ->
    case cowboy_req:match_qs([{'_filters', [], <<"{}">>}], Req) of
        #{'_filters' := Filter} ->
            jsx:decode(Filter, [{labels, atom}])
    end.

build_record(Rec, #state{fields=Fields, module=Module}) ->
    apply(Module, build, [
        lists:filter(fun({_, undefined}) -> false;
                        (_) -> true
                     end,
            lists:zip(Fields, tl(tuple_to_list(Rec))))]).

content_types_accepted(Req, State) ->
    {[
        {{<<"application">>, <<"json">>, '*'}, handle_write}
    ], Req, State}.

handle_write(Req, State) ->
    {ok, Data, Req2} = cowboy_req:read_body(Req),
    case jsx:is_json(Data) of
        true ->
            import_records(jsx:decode(Data, [{labels, atom}]), State),
            {true, Req2, State};
        false ->
            lager:debug("Bad JSON in HTTP request"),
            {stop, cowboy_req:reply(400, Req2), State}
    end.

import_records([], _State) -> ok;
import_records([First|Rest], State) when is_list(First) ->
    write_record(First, State),
    import_records(Rest, State);
import_records([First|_Rest] = List, State) when is_tuple(First) ->
    write_record(List, State).

write_record(List, #state{table=Table, record=Record, fields=Fields, module=Module}) ->
    Rec = list_to_tuple([Record|[proplists:get_value(X, apply(Module, parse, [List])) || X <- Fields]]),
    mnesia:transaction(fun() ->
        ok = mnesia:write(Table, Rec, write) end).

resource_exists(Req, #state{key=undefined}=State) ->
    {true, Req, State};
resource_exists(Req, #state{table=Table, key=Key}=State) ->
    case mnesia:dirty_read(Table, Key) of
        [] -> {false, Req, State};
        [_] -> {true, Req, State}
    end.

delete_resource(Req, #state{table=Table, key=Key}=State) ->
    ok = mnesia:dirty_delete(Table, Key),
    {true, Req, State}.

% end of file