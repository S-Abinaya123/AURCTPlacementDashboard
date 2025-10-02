import './loginLoading.css'


const LoginLoading = () => {
    return (
        <div className='outer-container z-50'>
            <div className="wrapper">
                <div className="box-wrap">
                    <div className="box one"></div>
                    <div className="box two"></div>
                    <div className="box three"></div>
                    <div className="box four"></div>
                    <div className="box five"></div>
                    <div className="box six"></div>
                </div>
                <div className="loading-text">Logging in...</div>
            </div>
        </div>
        
    )
}

export default LoginLoading