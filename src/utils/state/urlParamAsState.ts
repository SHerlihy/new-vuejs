import {ref, type Ref} from 'vue';
import {useRouter} from 'vue-router';

interface IURLParamAsState<T> {
    state: Ref<T>;
    remove: ()=>void;
    updateParamState: (state: string)=>void;
}

class urlParamAsState<T> implements IURLParamAsState<T> {
    private updateState = () =>{
            const params = this.currentRoute.value.query;
            if (!params || !params[this.paramState]){
                return;
            }
            this.state.value = params[this.paramState]
    }

    private currentRoute;
    private push;

    private paramState = "";

    state = ref();
    remove = ()=>{};

    constructor(initState: T, paramState: string){
        const { currentRoute, push, afterEach } = useRouter();
        this.currentRoute = currentRoute;
        this.push = push;

        this.state.value = initState;
        this.paramState = paramState;

        this.remove = afterEach(()=>{
            this.updateState();
        })

        this.updateState();
    }

    updateParamState = (value: string) => {
      this.push({
        query: {
          ...this.currentRoute.value.query,
         [this.paramState]: value,
        },
      });
    }
}

export default urlParamAsState;
