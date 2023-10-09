let right=document.querySelectorAll('.right img');
let left=document.querySelectorAll('.left');
left[7].style.opacity=1;
right.forEach(x=>x.addEventListener('click',function
()
{
    left.forEach(x=>x.style.opacity=0);
    let index=search(x);
    left[index].style.opacity=1;
    
        
}));

function search(x)
{
    
    for(let i=0;i<right.length;i++)
    {
        if(right[i]==x)return i;
    }
    return -1;
}