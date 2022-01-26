import Iter "mo:base/Iter";
import List "mo:base/List";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
actor {
    type Message = {
        text: Text;
        author: Text;
        time: Time.Time;
    };

    stable var name : Text = "LYD";
    public shared query func get_name(): async Text {
        name;
    };
    public shared query func set_name(author: Text) :async () {
        name := author;
    };

    public type Microblog = actor {
        follow: shared (Principal) -> async ();
        follows: shared query () -> async [Principal];
        post: shared (Text) -> async ();
        posts: shared query (Time.Time) -> async [Message];
        timeline: shared () -> async [Message];
        postsByPrincp: shared query (Principal,Time.Time) -> async [Message];
        get_name: shared query () -> async Text;
        set_name: shared (Text) -> async ();
    };

    stable var followed : List.List<Principal> = List.nil();
    public shared func follow(id: Principal) :async () {
        followed := List.push(id, followed);
    };
    public shared query func follows() :async [Principal]{
        List.toArray(followed);
    };


    stable var messages : List.List<Message> = List.nil();

    public shared(callMsg) func post(opt: Text, text: Text) :async () {
        // assert(Principal.toText(callMsg.caller) == "dijc6-cn3hx-74neg-6jzms-rpmgu-avaep-sb7b2-3ltoy-dew5m-bixtf-dae");
        assert(opt == "123456");
        let msg = { 
            text = text;
            author = "LYD";
            time = Time.now();
        };
        messages := List.push(msg, messages);
    };

    public shared query func posts(since: Time.Time) :async [Message]{
        let isSinceTime = func (msg: Message) : Bool {  msg.time > since };
        List.toArray(List.filter(messages, isSinceTime));
    };

    public shared func postsByPrincp(princp: Principal, since: Time.Time) :async [Message]{
        let canister : Microblog = actor(Principal.toText(princp));
        let msgs = await canister.posts(since);
        msgs;
    };

    public shared func timeline(since: Time.Time) :async [Message]{
        var feeds : List.List<Message> = List.nil();

        for (canisterId in Iter.fromList(followed)) {
            let canister : Microblog = actor(Principal.toText(canisterId));
            let msgs = await canister.posts(since);
            for(msg in Iter.fromArray(msgs)) {
                feeds := List.push(msg, feeds);
            }
        };
        List.toArray(feeds);
    };
};